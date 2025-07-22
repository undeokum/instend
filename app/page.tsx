'use client'
import NavBar from '@/components/nav'
import { auth, db } from './firebase'
import { User } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { UserDataInstructure } from '.'
import { doc, getDoc } from 'firebase/firestore'
import { location } from './neighbor/page'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

interface Place {
  name: string
  rating: number
  formatted_address: string
  user_ratings_total: number
}

const Home = () => {
    const [user, setUser] = useState<User | null>(null)
    const [userData, setUserData] = useState<UserDataInstructure>()
    const [restaurant, setRestaurant] = useState<Place[]>([])

    const fetchUserData = async () => {
        if(user?.uid){
            const userDataRef = doc(db, 'userData', user?.uid)
            const userDataSnap = await getDoc(userDataRef)
            if(userDataSnap.exists()){
                const { neighbor, school } = userDataSnap.data()
                setUserData({ neighbor, school })
            }
        }
    }

    const fetchRestaurant = () => {
        if(userData?.neighbor){
            fetch(`/restaurant/${location.indexOf(userData.neighbor)}.json`)
            .then(res => res.json())
            .then(data => setRestaurant(data))
        }
    }

    useEffect(() => {
        if(user){
            fetchUserData()
        }
    }, [user])

    useEffect(() => {
        fetchRestaurant()
    }, [userData])

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user)
        })
        
        return () => unsubscribe()
    }, [])
    return (
        <div>
            <div className='space-y-8'>
                <h1 className='text-2xl font-semi_bold'>{user?.displayName}님, 안녕하세요 👋</h1>
                <div className='space-y-5'>
                    <h1 className='text-xl font-semi_bold'>{userData?.neighbor} 맛집 리스트</h1>
                    {
                        restaurant.map((place, i) => (
                            <div key={i} className='space-y-3 border-black border border-opacity-20 rounded-md py-3 px-5'>
                                <div className='text-lg font-semi_bold'>{place.name}</div>
                                <div>{place.formatted_address}</div>
                                <div className='flex space-x-3'>
                                    <div>
                                        {
                                            [...Array(Math.floor(place.rating))].map((_, i) => <FontAwesomeIcon icon={faStar} key={i} className='size-5 text-yellow-400' />)
                                        }
                                        {
                                            [...Array(5 - Math.floor(place.rating))].map((_, i) => <FontAwesomeIcon icon={faStar} key={i} className='size-5 text-black opacity-20' />)
                                        }
                                    </div>
                                    <span>{place.rating}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <NavBar route='' />
        </div>
    )
}

export default Home