'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'
import LoginModal from '@/app/components/LoginModal'

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.875rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.125rem;
`

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  &:hover { background: #5568d3; }
`

export default function HeaderBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('isLoggedIn') === 'true'
  })

  const [username, setUsername] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('username') || ''
  })

  // Sync auth state from localStorage on mount (handles SSR hydration refresh)
  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn') === 'true'
    const user = localStorage.getItem('username') || ''
    setIsLoggedIn(logged)
    setUsername(user)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn') {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true')
      }
      if (e.key === 'username') {
        setUsername(localStorage.getItem('username') || '')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const openLogin = useCallback(() => setIsOpen(true), [])
  const closeLogin = useCallback(() => setIsOpen(false), [])
  const onLoginSuccess = useCallback(() => {
    const user = localStorage.getItem('username') || ''
    setIsLoggedIn(true)
    setUsername(user)
    setIsOpen(false)
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('localStorageChange'))
  }, [])

  const onLogout = useCallback(() => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    setIsLoggedIn(false)
    setUsername('')
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('localStorageChange'))
  }, [])

  return (
    <Header>
      <HeaderContent>
        <Title href="/">Golf Platform{username ? ` — ${username}` : ''}</Title>
        {isLoggedIn ? (
          <ActionButton onClick={onLogout}>Logout</ActionButton>
        ) : (
          <ActionButton onClick={openLogin}>Login</ActionButton>
        )}
      </HeaderContent>
      <LoginModal open={isOpen} onClose={closeLogin} onSuccess={onLoginSuccess} />
    </Header>
  )
}


