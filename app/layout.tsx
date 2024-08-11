import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <body className='max-w-screen-sm mx-auto border-x border-black border-opacity-20 min-h-screen font-regular'>
        <div className='px-10 pt-16 pb-32'>{children}</div>
      </body>
    </html>
  )
}
