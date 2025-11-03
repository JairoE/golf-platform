'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from '@emotion/styled'

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const LoginCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`

const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Button = styled.button`
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #5568d3;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple authentication (in production, this would call your backend)
    if (username && password) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username)
      router.push('/home')
    } else {
      setError('Please enter both username and password')
      setLoading(false)
    }
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Golf Platform Login</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </LoginCard>
    </LoginContainer>
  )
}

