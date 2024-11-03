'use client'
import { auth } from '@/app/firebase'
import { faEarth, faHome, faSchool, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { onAuthStateChanged } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const navIcon = [faHome, faEarth, faSchool, faUser]
const navName = ['전체', '동네', '학교/회사', '내 정보']
const navHref = ['', 'neighbor', 'school', 'user?folder=all']

interface navbarType {
    route: string
}

const NavBar = (props: navbarType) => {
    const router = useRouter()
    useEffect(() => {
        onAuthStateChanged(auth, userr => {
            if (!userr) {
                router.push('/auth')
            }
        })
    }, [])
    return (
        <header>
            {
                props.route == 'un'
                ?
                <></>
                :
                <nav className='fixed max-w-screen-sm flex border border-black border-opacity-20 w-full bottom-0 py-4 space-x-20 justify-center bg-white left-[50%]'>
                    {
                        navIcon.map((icon, i) => (
                            <Link href={`/${navHref[i]}`} key={i} className={`flex flex-col items-center space-y-1 ${props.route == navHref[i].split('?')[0] ? 'text-instend' : 'opacity-50 hover:opacity-60 transition-opacity'}`}>
                                <FontAwesomeIcon icon={icon} className='w-6 h-6' />
                                <div>{navName[i]}</div>
                            </Link>
                        ))
                    }
                </nav>
            }
        </header>
    )
}

export default NavBar