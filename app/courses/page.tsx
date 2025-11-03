"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import styled from "@emotion/styled";

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
  const [teeTimes, setTeeTimes] = useState<Record<string, TeeTimeData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // TODO: Move this to database or s3 bucket or some other persistent storage
  const courses: Record<string, string> = {
    bethpage:
      "https://foreupsoftware.com/index.php/booking/19765/2431#teetimes",
    // marine_park: "https://marineparkridepp.ezlinksgolf.com/index.html#/search",
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  const fetchTeeTime = async (courseName: string, courseUrl: string) => {
    setLoading((prev) => ({...prev, [courseName]: true}));
    setErrors((prev) => ({...prev, [courseName]: ""}));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiUrl}/api/tee-times/${courseName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({url: courseUrl}),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tee times: ${response.statusText}`);
      }

      const data = await response.json();
      setTeeTimes((prev) => ({
        ...prev,
        [courseName]: {course: courseName, url: courseUrl, data},
      }));
    } catch (error) {
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
          <BackButton onClick={() => router.push("/home")}>
            Back to Home
          </BackButton>
        </HeaderContent>
      </Header>
      <Content>
        {Object.entries(courses).map(([courseName, courseUrl]) => (
          <CourseCard key={courseName}>
            <CourseName>{courseName.replace("_", " ")}</CourseName>
            <TeeTimeButton
              onClick={() => fetchTeeTime(courseName, courseUrl)}
              disabled={loading[courseName]}
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
