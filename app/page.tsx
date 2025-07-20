'use client'
import NavBar from '@/components/nav'
import { auth } from './firebase'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { UserDataInstructure } from '.'

const Home = () => {
    const [user, setUser] = useState<User | null>(null)
    const [userData, setUserData] = useState<UserDataInstructure>()
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user)
        })
        
        return () => unsubscribe()
    }, [])
    return (
        <div>
            <div>
                <h1 className='text-2xl font-semi_bold'>{user?.displayName}님, 안녕하세요 👋</h1>
                <div>
                </div>
                <div></div>
                <div></div>
            </div>
            <NavBar route='' />
        </div>
    )
}

export default Home