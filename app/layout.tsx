'use client'
import { useEffect } from 'react'
import { auth } from './firebase'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const loader = async () => await auth.authStateReady()
  useEffect(() => {
    loader()
  }, [])
  return (
    <html lang='ko'>
      <body className='max-w-screen-sm mx-auto border-x border-black border-opacity-20 min-h-screen font-regular'>
          <div className='px-8 pt-16 pb-32'>{children}</div>
      </body>
    </html>
  )
}
