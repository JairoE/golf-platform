'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from '@emotion/styled'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background: #fff;
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`

const Header = styled.div`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  color: #333;
`

const Close = styled.button`
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`

const Body = styled.div`
  padding: 1.25rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
`

const Button = styled.button`
  padding: 0.75rem;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #5568d3; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
`

export interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: (username: string) => void
}

export default function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setUsername('')
      setPassword('')
      setError('')
      setLoading(false)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (username && password) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', username)
      setLoading(false)
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('localStorageChange'))
      onSuccess?.(username)
      onClose()
    } else {
      setError('Please enter both username and password')
      setLoading(false)
    }
  }

  return createPortal(
    <Overlay onClick={onClose} role="dialog" aria-modal="true">
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Login</Title>
          <Close aria-label="Close" onClick={onClose}>×</Close>
        </Header>
        <Body>
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
        </Body>
      </Modal>
    </Overlay>,
    document.body
  )
}


