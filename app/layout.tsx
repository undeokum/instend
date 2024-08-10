import { faEarth, faHome, faSchool, faUser } from '@fortawesome/free-solid-svg-icons'
import './globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const navIcon = [faHome, faEarth, faSchool, faUser]
const navName = ['홈', '동네', '학교', '내 정보']

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <body className='font-regular min-h-screen flex flex-col items-center max-w-screen-sm mx-auto border-x border-black border-opacity-20'>
        <div className='max-w-screen-sms'>{children}</div>
        <nav className='fixed flex w-full max-w-screen-sm border-t border-x space-x-20 justify-center border-black border-opacity-20 bg-white bottom-0 py-4'>
          {
            navIcon.map((icon, i) => (
              <div key={i} className='flex flex-col items-center opacity-50'>
                <FontAwesomeIcon icon={icon} className='w-6 h-6' />
                <div>{navName[i]}</div>
              </div>
            ))
          }
        </nav>
      </body>
    </html>
  )
}
