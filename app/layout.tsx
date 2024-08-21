'use client'
import { useEffect, useState } from 'react';
import { auth } from './firebase';
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [loading, setLoading] = useState(true)
  const loader = async () => {
    await auth.authStateReady()
    setLoading(false)
  }
  useEffect(() => {
    loader()
  }, [])
  return (
    <html lang='ko'>
    <body className='max-w-screen-sm mx-auto border-x border-black border-opacity-20 min-h-screen font-regular'>
      {
        loading
        ?
        <div className='flex flex-col items-center h-screen justify-center space-y-5'>
          <div className='w-12 h-12 border-8 border-instend border-t-transparent rounded-full loader'></div>
          <h1 className='text-2xl'>페이지 로딩중...</h1>
        </div>
        :
        <div className='px-10 pt-16 pb-32'>{children}</div>
      }
    </body>
  </html>
  )
}
