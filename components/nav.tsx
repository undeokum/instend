'use client'
import { auth } from '@/app/firebase'
import { faEarth, faHome, faSchool, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

const navIcon = [faHome, faEarth, faSchool, faUser]
const navName = ['홈', '동네', '학교', '내 정보']
const navHref = ['', 'neighbor', 'school', 'user']

interface navbarType {
    route: string
}

const NavBar = (props: navbarType) => {
    console.log(auth.currentUser)
    return (
        <nav className='fixed max-w-screen-sm flex border border-black border-opacity-20 w-full bottom-0 py-4 space-x-20 justify-center bg-white left-[50%]'>
            {
                navIcon.map((icon, i) => (
                    <Link href={`/${navHref[i]}`} key={i} className={`flex flex-col items-center space-y-1 ${props.route == navHref[i] ? 'text-instend' : 'opacity-50 hover:opacity-60 transition-opacity'}`}>
                        <FontAwesomeIcon icon={icon} className='w-6 h-6' />
                        <div>{navName[i]}</div>
                    </Link>
                ))
            }
        </nav>
    )
}

export default NavBar