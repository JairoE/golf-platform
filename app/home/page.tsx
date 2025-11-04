"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import styled from "@emotion/styled";
import Link from "next/link";
import {states, type StateId} from "@/lib/courses";

const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
`;

// Header is provided globally in layout

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

const StateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

const StateLink = styled(Link)`
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [username, setUsername] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("username") || "";
  });

  // Sync auth state from localStorage on mount and when it changes
  useEffect(() => {
    const updateAuthState = () => {
      const logged = localStorage.getItem("isLoggedIn") === "true";
      const user = localStorage.getItem("username") || "";
      setIsLoggedIn(logged);
      setUsername(user);
    };

    // Initial sync
    updateAuthState();

    // Listen for storage changes (logout from header)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "isLoggedIn" || e.key === "username") {
        updateAuthState();
      }
    };

    window.addEventListener("storage", handleStorage);

    // Also listen for custom events (same-tab changes)
    const handleCustomStorage = () => {
      updateAuthState();
    };

    // Listen for custom storage change events
    window.addEventListener("localStorageChange", handleCustomStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("localStorageChange", handleCustomStorage);
    };
  }, []);

  // Only show NY for now, but structure is ready for more
  const availableStateIds: StateId[] = ["ny"];

  return (
    <HomeContainer>
      <Content>
        <WelcomeCard>
          <h2>Welcome{username ? `, ${username}` : ""}!</h2>
          <p>Select a state to browse available courses.</p>
          <StateGrid>
            {availableStateIds.map((id) => (
              <StateLink
                key={id}
                href={{pathname: "/courses", query: {state: id}}}
                style={{textDecoration: "none", color: "inherit"}}
              >
                <h3 style={{margin: 0}}>{states[id].name}</h3>
                <p style={{margin: "0.25rem 0 0", color: "#666"}}>
                  {Object.keys(states[id].courses).length} course(s)
                </p>
              </StateLink>
            ))}
          </StateGrid>
        </WelcomeCard>
      </Content>
    </HomeContainer>
  );
}
