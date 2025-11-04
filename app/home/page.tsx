"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import styled from "@emotion/styled";
import Link from "next/link";
import LoginModal from "@/app/components/LoginModal";
import {cities, type CityId} from "@/lib/courses";

const HomeContainer = styled.div`
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

const ActionButton = styled.button`
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

const WelcomeCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const CityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

const CityCard = styled.button`
  text-align: left;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // Open modal if redirected with ?login=true
  useEffect(() => {
    if (searchParams?.get("login") === "true") {
      setIsLoginOpen(true);
    }
  }, [searchParams]);

  const username = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("username") || "";
  }, [isLoggedIn]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleCityClick = useCallback(
    (cityId: CityId) => {
      router.push(`/courses?city=${cityId}`);
    },
    [router]
  );

  // Only show NYC for now, but structure is ready for more
  const availableCityIds: CityId[] = ["nyc"];

  return (
    <HomeContainer>
      <Header>
        <HeaderContent>
          <Title>Golf Platform</Title>
          {isLoggedIn ? (
            <ActionButton onClick={handleLogout}>Logout</ActionButton>
          ) : (
            <ActionButton onClick={() => setIsLoginOpen(true)}>
              Login
            </ActionButton>
          )}
        </HeaderContent>
      </Header>
      <Content>
        <WelcomeCard>
          <h2>Welcome{username ? `, ${username}` : ""}!</h2>
          <p>Select a city to browse available courses.</p>
          <CityGrid>
            {availableCityIds.map((id) => (
              <CityCard key={id} onClick={() => handleCityClick(id)}>
                <h3 style={{margin: 0}}>{cities[id].name}</h3>
                <p style={{margin: "0.25rem 0 0", color: "#666"}}>
                  {Object.keys(cities[id].courses).length} course(s)
                </p>
              </CityCard>
            ))}
          </CityGrid>
        </WelcomeCard>
      </Content>
      <LoginModal
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </HomeContainer>
  );
}
