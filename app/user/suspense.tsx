'use client'
import Card from '@/components/card'
import NavBar from '@/components/nav'
import { auth, db } from '../firebase'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { PostInstructure, UserDataInstructure } from '..'
import { signOut, User } from 'firebase/auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const UserSuspense = () => {
    const router = useRouter()
    const searchParams = useSearchParams().get('folder')

    const [posts, setPosts] = useState<PostInstructure[]>([])
    const [userData, setUserData] = useState<UserDataInstructure>()
    const [user, setUser] = useState<User | null>(null)

    const fetchPosts = async () => {
        if(searchParams && user){
            console.log(searchParams == 'neighbor' ? `neighbor${userData?.neighbor}` : (searchParams == 'school' ? `school${userData?.school}` : 'all'))
            const postsQuery = query(
                collection(db, searchParams == 'neighbor' ? `neighbor${userData?.neighbor}` : (searchParams == 'school' ? `school${userData?.school}` : 'all')),
                where('userId', '==', user?.uid),
                orderBy('mm', 'desc')
            )
            const snapshop = await getDocs(postsQuery)
            const posts = snapshop.docs.map(doc => {
                const {
                    image,
                    content,
                    createdAt,
                    userId,
                    userName,
                    mm,
                } = doc.data()
                return {
                    image,
                    content,
                    createdAt,
                    userId,
                    userName,
                    mm,
                    id: doc.id
                }
            })
            setPosts(posts)
        }
    }

    const fetchUserData = async () => {
        if(user){
            const userDataRef = doc(db, 'userData', user?.uid)
            const userDataSnap = await getDoc(userDataRef)
            if(userDataSnap.exists()){
                const { neighbor, school } = userDataSnap.data()
                setUserData({ neighbor, school })
            }
        }
    }

    const onClick = async () => {
        if(user){
            await signOut(auth)
            router.push('/auth')
        }
    }

    useEffect(() => {
        const userSet = auth.onAuthStateChanged(user => {
            setUser(user)
        })
        
        return () => userSet()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUserData()
        }
    }, [user])
    

    useEffect(() => {
        fetchPosts()
    }, [userData, searchParams])
    return (
        <div>
            <div className='space-y-16'>
                <div className='flex flex-col items-center space-y-8 border border-black border-opacity-20 w-full py-10 rounded-md'>
                    <div className='space-y-4'>
                        <div className='space-y-2 text-lg text-center'>
                            <h1 className='text-4xl font-semi_bold'>{user?.displayName}</h1>
                        </div>
                        <div className='flex space-x-2 text-black text-opacity-50 justify-center items-center'>
                            <span>{userData?.neighbor || '동네 정보 미설정'}</span>
                            <div>&#183;</div>
                            <span>{userData?.school || '학교/회사 정보 미설정'}</span>
                        </div>
                    </div>
                    <div className='w-[52%] space-y-4'>
                        <Link href='/edit' className='bg-instend hover:bg-hover transition-colors text-white py-1.5 rounded-md text-lg flex items-center justify-center'>내 정보 수정하기</Link>
                        <div onClick={onClick} className='border border-instend text-instend bg-white py-1.5 rounded-md text-lg flex items-center justify-center hover:brightness-95 transition-all cursor-pointer'>로그아웃</div>
                    </div>
                </div>
                <div className='space-y-5'>
                    <h1 className='text-2xl font-semi_bold'>내가 작성한 글들</h1>
                    <div className='space-y-10'>
                        <form className='flex items-center space-x-16'>
                            {
                                [
                                    ['전체', 'all'],
                                    ['이웃', 'neighbor'],
                                    ['학교', 'school']
                                ].map(([name, path], i) => (
                                    <Link href={`/user?folder=${path}`} key={i} className={`flex items-center justify-center rounded-full hover:brightness-90 transition-all ${searchParams == path ? 'bg-instend text-white border-instend' : 'bg-white text-black border border-black border-opacity-20'} px-5 py-2 text-lg`}>
                                        {name}
                                    </Link>
                                ))
                            }
                        </form>
                        <div className='space-y-8'>
                            {
                                posts.map(postInfo => <Card key={postInfo.id} {...postInfo} folder={searchParams == 'neighbor' ? `neighbor${userData?.neighbor}` : (searchParams == 'school' ? `school${userData?.school}` : 'all')} />)
                            }
                        </div>
                        <NavBar route='school' />
                    </div>
                </div>
            </div>
            <NavBar route='user' />
        </div>
    )
}

export default UserSuspense