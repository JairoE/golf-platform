import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import HeaderBar from '@/app/components/HeaderBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Golf Platform',
  description: 'Golf course booking platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeaderBar />
        {children}
      </body>
    </html>
  )
}

