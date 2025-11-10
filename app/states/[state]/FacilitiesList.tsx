"use client";

import {createElement, useEffect, useMemo, useState} from "react";
import styled from "@emotion/styled";
import {
  getElementsFromHtmlNodeJsons,
  HtmlNodeJson,
  htmlStringToJson,
} from "../../utils/htmlToJson";
import {Course} from "../../types/course";

const FacilitiesContainer = styled.div`
  padding: 1.5rem;
`;

const FacilitiesTitle = styled.h3`
  color: #333;
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-bottom: 1rem;

  &:hover {
    background: #7f8c8d;
  }
`;

const LoadingMessage = styled.p`
  color: #666;
  font-style: italic;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin: 0;
`;

const FacilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FacilityCard = styled.div`
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FacilityName = styled.h4`
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const FacilityInfo = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.875rem;
`;

const FacilityJson = styled.pre`
  color: #444;
  background: #f5f5f5;
  border-radius: 6px;
  padding: 0.75rem;
  margin: 0.5rem 0 0;
  font-size: 0.75rem;
  overflow-x: auto;
`;

interface Facility {
  id?: string;
  name?: string;
  url?: string;
  raw_html?: string;
  htmlJson?: HtmlNodeJson[];
  elements?: HtmlNodeJson[];
}

interface FacilitiesListProps {
  course: Course;
  onBack: () => void;
}

export default function FacilitiesList({course, onBack}: FacilitiesListProps) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const {url: courseUrl, selector, name: courseName, dataSelectors} = course;

  const facilitiesWithStructure = useMemo(() => {
    const f = facilities.map((facility) => ({
      ...facility,
      id: facility?.id?.split("-").pop(),
      htmlJson: facility.raw_html
        ? htmlStringToJson(facility.raw_html)
        : undefined,
    }));

    if (!dataSelectors) {
      return f;
    }

    const fWithElements = f.map((facility) => {
      const facilitySelector = dataSelectors?.map((selector) => ({
        tag: selector?.tag,
        attributes: {
          ...selector.attributes,
          "data-testid": `facility-${facility.id}${selector?.attributes?.["data-testid"]}`,
        },
      }));

      return {
        ...facility,
        elements: getElementsFromHtmlNodeJsons(
          facility.htmlJson ?? [],
          facilitySelector
        ),
      };
    });

    return fWithElements;
  }, [facilities, dataSelectors]);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      setError("");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      try {
        const response = await fetch(`${apiUrl}/api/scrape-courses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: courseUrl,
            selector: selector || "",
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch facilities: ${response.statusText}`);
        }

        const data = await response.json();
        setFacilities(Array.isArray(data.courses) ? data.courses : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch facilities"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [courseUrl, selector]);

  return (
    <FacilitiesContainer>
      <BackButton onClick={onBack}>← Back to Courses</BackButton>
      <FacilitiesTitle>Available Facilities</FacilitiesTitle>
      {loading && <LoadingMessage>Loading facilities...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && facilitiesWithStructure.length === 0 && (
        <ErrorMessage>No facilities found.</ErrorMessage>
      )}
      {!loading && !error && facilitiesWithStructure.length > 0 && (
        <FacilitiesGrid>
          {facilitiesWithStructure.map((facility, index) => (
            <FacilityCard key={facility.id || facility.url || index}>
              <FacilityName>
                {facility.name || `Facility ${index + 1}`}
              </FacilityName>
              {/* {facility.htmlJson && facility.htmlJson.length > 0 && (
                <FacilityJson>
                  {JSON.stringify(facility.htmlJson, null, 2)}
                </FacilityJson>
              )} */}
              {facility.elements &&
                facility.elements.length > 0 &&
                facility.elements.map((element, elementIndex) => {
                  if (element.type === "text") {
                    return (
                      <span
                        key={`${
                          facility.id || facility.url || index
                        }-text-${elementIndex}`}
                      >
                        {element.text ?? ""}
                      </span>
                    );
                  }

                  const tagName = (element.type ??
                    "div") as keyof JSX.IntrinsicElements;
                  const key =
                    element.attributes?.["data-testid"] ??
                    `${
                      facility.id || facility.url || index
                    }-el-${elementIndex}`;

                  return createElement(
                    tagName,
                    {
                      key,
                      ...element.attributes,
                    },
                    element.text ?? null
                  );
                })}
            </FacilityCard>
          ))}
        </FacilitiesGrid>
      )}
    </FacilitiesContainer>
  );
}
