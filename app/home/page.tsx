'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styled from '@emotion/styled'
import Link from 'next/link'
import { states } from '../data/courses'

const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
`

const Header = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h1`
  color: #333;
  margin: 0;
`

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: #c0392b;
  }
`

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const WelcomeCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const StatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`

const StateLink = styled(Link)`
  display: block;
  padding: 1.5rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 500;
  text-align: center;
  transition: background 0.2s, transform 0.2s;
  
  &:hover {
    background: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    router.push('/login')
  }

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : ''

  return (
    <HomeContainer>
      <Header>
        <HeaderContent>
          <Title>Golf Platform</Title>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </HeaderContent>
      </Header>
      <Content>
        <WelcomeCard>
          <h2>Welcome, {username || 'User'}!</h2>
          <p>Select a state to view available golf courses and book your tee times.</p>
          <StatesGrid>
            {states.map((state) => (
              <StateLink key={state.code} href={`/states/${state.code}`}>
                {state.name}
              </StateLink>
            ))}
          </StatesGrid>
        </WelcomeCard>
      </Content>
    </HomeContainer>
  )
}

