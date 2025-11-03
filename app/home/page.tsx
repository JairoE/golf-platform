'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styled from '@emotion/styled'
import Link from 'next/link'

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

const CourseLink = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.125rem;
  transition: background 0.2s;
  
  &:hover {
    background: #5568d3;
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
          <p>Browse available golf courses and book your tee times.</p>
          <CourseLink href="/courses">Available Courses</CourseLink>
        </WelcomeCard>
      </Content>
    </HomeContainer>
  )
}

