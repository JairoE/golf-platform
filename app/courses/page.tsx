"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import styled from "@emotion/styled";
import {getStateById, states} from "@/lib/courses";

const CoursesContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
`;

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background: #5568d3;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CourseCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const CourseName = styled.h2`
  color: #333;
  margin: 0 0 1rem 0;
  text-transform: capitalize;
`;

const TeeTimeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 1rem;

  &:hover {
    background: #229954;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.p`
  color: #666;
  font-style: italic;
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 0.5rem;
`;

const TeeTimeInfo = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
`;

const TeeTimeText = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.875rem;
`;

interface TeeTimeData {
  course: string;
  url: string;
  data?: any;
}

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [teeTimes, setTeeTimes] = useState<Record<string, TeeTimeData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const state = useMemo(() => {
    const stateParam = searchParams?.get("state");
    return getStateById(stateParam || "ny");
  }, [searchParams]);

  const courses: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    const courseMap = state?.courses ?? states.ny.courses;
    for (const [key, c] of Object.entries(courseMap)) {
      map[key] = c.url;
    }
    return map;
  }, [state]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/home?login=true");
    }
  }, [router]);

  const fetchTeeTime = async (courseName: string, courseUrl: string) => {
    console.log("fetchTeeTime called", {courseName, courseUrl});
    setLoading((prev) => ({...prev, [courseName]: true}));
    setErrors((prev) => ({...prev, [courseName]: ""}));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    console.log("API URL:", apiUrl);

    try {
      const requestUrl = `${apiUrl}/api/tee-times/${courseName}`;
      console.log("Making request to:", requestUrl);

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({url: courseUrl}),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`Failed to fetch tee times: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Tee time data received:", data);
      setTeeTimes((prev) => ({
        ...prev,
        [courseName]: {course: courseName, url: courseUrl, data},
      }));
    } catch (error) {
      console.error("Error fetching tee times:", error);
      setErrors((prev) => ({
        ...prev,
        [courseName]:
          error instanceof Error ? error.message : "Failed to fetch tee times",
      }));
    } finally {
      setLoading((prev) => ({...prev, [courseName]: false}));
    }
  };

  return (
    <CoursesContainer>
      <Header>
        <HeaderContent>
          <Title>Available Courses</Title>
          <BackButton onClick={() => router.push("/")}>Back to Home</BackButton>
        </HeaderContent>
      </Header>
      <Content>
        {Object.entries(courses).length === 0 && (
          <p>No courses available. Please check the state selection.</p>
        )}
        {Object.entries(courses).map(([courseName, courseUrl]) => (
          <CourseCard key={courseName}>
            <CourseName>{courseName.replace("_", " ")}</CourseName>
            <TeeTimeButton
              onClick={(e) => {
                e.preventDefault();
                console.log("Button clicked for:", courseName);
                fetchTeeTime(courseName, courseUrl);
              }}
              disabled={loading[courseName]}
              type="button"
            >
              {loading[courseName] ? "Loading..." : "Get Tee Times"}
            </TeeTimeButton>
            {errors[courseName] && (
              <ErrorMessage>{errors[courseName]}</ErrorMessage>
            )}
            {teeTimes[courseName]?.data && (
              <TeeTimeInfo>
                <h3>Tee Time Data:</h3>
                <TeeTimeText>
                  {JSON.stringify(teeTimes[courseName].data, null, 2)}
                </TeeTimeText>
              </TeeTimeInfo>
            )}
          </CourseCard>
        ))}
      </Content>
    </CoursesContainer>
  );
}
