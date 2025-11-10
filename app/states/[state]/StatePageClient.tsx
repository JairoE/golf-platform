"use client";

import {useEffect, useState} from "react";
import {useRouter, useParams} from "next/navigation";
import styled from "@emotion/styled";
import {coursesByState, states} from "../../data/courses";
import TeeTimeForm from "./TeeTimeForm";
import FacilitiesList from "./FacilitiesList";
import {Course} from "../../types/course";

const StateContainer = styled.div`
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
  max-width: 1400px;
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
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MapContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.125rem;
`;

const CoursesPanel = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const CoursesTitle = styled.h2`
  color: #333;
  margin: 0 0 1.5rem 0;
`;

const CourseCard = styled.div`
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const CourseName = styled.h3`
  color: #333;
  margin: 0 0 0.5rem 0;
  text-transform: capitalize;
  font-size: 1.25rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:hover {
    background: #229954;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const FacilitiesButton = styled(ActionButton)`
  background: #667eea;

  &:hover {
    background: #5568d3;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin-top: 0.5rem;
`;

const LoadingMessage = styled.p`
  color: #666;
  font-style: italic;
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

const NoCoursesMessage = styled.p`
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 2rem;
`;

type ViewState =
  | {type: "courses"}
  | {type: "teeTimeForm"; course: Course}
  | {type: "facilities"; course: Course};

interface TeeTimeData {
  course: string;
  url: string;
  data?: any;
}

export default function StatePageClient() {
  const router = useRouter();
  const params = useParams();
  const stateCode = params?.state as string;

  const [viewState, setViewState] = useState<ViewState>({type: "courses"});
  const [teeTimes, setTeeTimes] = useState<Record<string, TeeTimeData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const state = states.find((s) => s.code === stateCode);
  const courses = stateCode ? coursesByState[stateCode] || [] : [];

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!state) {
      router.push("/home");
    }
  }, [router, state]);

  const handleRequestTeeTime = async (
    course: Course,
    formData: {
      start: string;
      end: string;
      date: string;
      deadline: string;
    }
  ) => {
    setLoading((prev) => ({...prev, [course.id]: true}));
    setErrors((prev) => ({...prev, [course.id]: ""}));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiUrl}/api/tee-times/${course.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: course.url,
          start: formData.start,
          end: formData.end,
          date: formData.date,
          deadline: formData.deadline,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tee times: ${response.statusText}`);
      }

      const data = await response.json();
      setTeeTimes((prev) => ({
        ...prev,
        [course.id]: {course: course.id, url: course.url, data},
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [course.id]:
          error instanceof Error ? error.message : "Failed to fetch tee times",
      }));
    } finally {
      setLoading((prev) => ({...prev, [course.id]: false}));
    }
  };

  if (!state) {
    return null;
  }

  return (
    <StateContainer>
      <Header>
        <HeaderContent>
          <Title>{state.name} Golf Courses</Title>
          <BackButton onClick={() => router.push("/home")}>
            Back to Home
          </BackButton>
        </HeaderContent>
      </Header>
      <Content>
        <MapContainer>
          <div>Map Placeholder</div>
        </MapContainer>
        <CoursesPanel>
          <CoursesTitle>Available Courses</CoursesTitle>
          {viewState.type === "courses" && (
            <>
              {courses.length === 0 ? (
                <NoCoursesMessage>
                  No courses available for {state.name} at this time.
                </NoCoursesMessage>
              ) : (
                courses.map((course) => (
                  <CourseCard key={course.id}>
                    <CourseName>{course.name}</CourseName>
                    {course.hasMultipleFacilities ? (
                      <FacilitiesButton
                        onClick={() =>
                          setViewState({type: "facilities", course})
                        }
                      >
                        View All Facilities
                      </FacilitiesButton>
                    ) : (
                      <ActionButton
                        onClick={() =>
                          setViewState({type: "teeTimeForm", course})
                        }
                      >
                        Request Tee Time
                      </ActionButton>
                    )}
                    {errors[course.id] && (
                      <ErrorMessage>{errors[course.id]}</ErrorMessage>
                    )}
                    {teeTimes[course.id]?.data && (
                      <TeeTimeInfo>
                        <h3>Tee Time Data:</h3>
                        <TeeTimeText>
                          {JSON.stringify(teeTimes[course.id].data, null, 2)}
                        </TeeTimeText>
                      </TeeTimeInfo>
                    )}
                  </CourseCard>
                ))
              )}
            </>
          )}
          {viewState.type === "teeTimeForm" && (
            <>
              <TeeTimeForm
                courseId={viewState.course.id}
                courseUrl={viewState.course.url}
                onSubmit={(formData) =>
                  handleRequestTeeTime(viewState.course, formData)
                }
                onCancel={() => setViewState({type: "courses"})}
                loading={loading[viewState.course.id] || false}
                error={errors[viewState.course.id]}
              />
              {teeTimes[viewState.course.id]?.data && (
                <TeeTimeInfo>
                  <h3>Tee Time Data:</h3>
                  <TeeTimeText>
                    {JSON.stringify(
                      teeTimes[viewState.course.id].data,
                      null,
                      2
                    )}
                  </TeeTimeText>
                </TeeTimeInfo>
              )}
            </>
          )}
          {viewState.type === "facilities" && (
            <FacilitiesList
              course={viewState.course}
              onBack={() => setViewState({type: "courses"})}
            />
          )}
        </CoursesPanel>
      </Content>
    </StateContainer>
  );
}
