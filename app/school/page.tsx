'use client'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavBar from '@/components/nav'
import Card from '@/components/card'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { PostInstructure, UserDataInstructure } from '..'
import WriteBtn from '@/components/write-btn'
import { User } from 'firebase/auth'
import { useForm } from 'react-hook-form'

const location = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도', '해외']

interface LocationSelect { select: string }

const School = () => {
    const [posts, setPosts] = useState<PostInstructure[]>([])
    const [userData, setUserData] = useState<UserDataInstructure>()
    const [user, setUser] = useState<User | null>(null)
    const [changed, setChanged] = useState(false)

    const { register, handleSubmit } = useForm<LocationSelect>()


    const fetchPosts = async () => {
        if(userData){
            const postsQuery = query(
                collection(db, `school${userData?.school}`),
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
        if(user?.uid){
            const userDataRef = doc(db, 'userData', user?.uid)
            const userDataSnap = await getDoc(userDataRef)
            if(userDataSnap.exists()){
                const { neighbor, school } = userDataSnap.data()
                setUserData({ neighbor, school })
            }
        }
    }

    const onValid = async (data: LocationSelect) => {
        if(user?.uid){
            await updateDoc(doc(db, 'userData', user?.uid), {
                neighbor: userData?.neighbor,
                school: data.select.replaceAll(' ', '')
            })
        }
        setChanged(!changed)
    }

    const reset = async () => {
        if(user){
            await updateDoc(doc(db, 'userData', user.uid), {
                neighbor: userData?.neighbor,
                school: ''
            })
        }
        setChanged(!changed)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(userr => {
            setUser(userr)
        })
        
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if(user){
            fetchUserData()
        }
    }, [user, changed])

    useEffect(() => {
        fetchPosts()
    }, [userData])

    return (
        <div>
            {
                userData?.school == ''
                ?
                <div className='flex flex-col items-center justify-center pt-20 font-semi_bold space-y-10'>
                    <h1 className='text-3xl'>학교/회사 설정이 필요합니다.</h1>
                    
                    <form className='flex flex-col space-y-3' onSubmit={handleSubmit(onValid)}>
                        <h1 className='text-xl'>학교/회사 입력 하기</h1>
                        <p className='text-red-500'>* 실제 재학 중인 학교 또는 다니고 있는 회사를 입력해주세요.</p>
                        <input
                            {
                                ...register('select',
                                    {
                                        required: '학교 또는 회사 이름을 입력해주세요.',
                                    }
                                )
                            }
                            type='text'
                            className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none'
                        />
                        <button type='submit' className='px-20 py-2 bg-instend hover:brightness-90 text-white rounded-md transition-all'>저장하기</button>
                    </form>
                </div>
                :
                <div className='space-y-10'>
                    <div className='flex items-center space-x-5'>
                        <h1 className='text-2xl font-bold'>{userData?.school}</h1>
                        <FontAwesomeIcon icon={faArrowsRotate} onClick={reset} className='w-6 h-6 opacity-50 hover:opacity-60 transition-all cursor-pointer' />
                    </div>
                    <div className='space-y-8'>
                        {
                            posts.map(postInfo => <Card key={postInfo.id} {...postInfo} folder={`school${userData?.school}`} />)
                        }
                    </div>
                    <WriteBtn query='school' />
                </div>
            }
            <NavBar route='school' />
        </div>
    )
}

export default School