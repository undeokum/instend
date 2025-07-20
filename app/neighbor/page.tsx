'use client'
import { faArrowsRotate, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavBar from '@/components/nav'
import Card from '@/components/card'
import { useEffect, useRef, useState } from 'react'
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { PostInstructure, UserDataInstructure } from '..'
import WriteBtn from '@/components/write-btn'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useForm } from 'react-hook-form'

const location = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도', '해외']

interface LocationSelect { select: string }

const Neighbor = () => {
    const [posts, setPosts] = useState<PostInstructure[]>([])
    const [userData, setUserData] = useState<UserDataInstructure>()
    const [user, setUser] = useState<User | null>(null)
    const [changed, setChanged] = useState(false)
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(false)
    const [opened, setOpened] = useState(false)

    const { register, handleSubmit } = useForm<LocationSelect>()


    const fetchPosts = async () => {
        if(userData){
            const postsQuery = query(
                collection(db, `neighbor${userData?.neighbor}`),
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
                    summary,
                } = doc.data()
                return {
                    image,
                    content,
                    createdAt,
                    userId,
                    userName,
                    mm,
                    summary,
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
        if(user){
            await updateDoc(doc(db, 'userData', user.uid), {
                neighbor: data.select,
                school: userData?.school
            })
        }
        setChanged(!changed)
    }

    const reset = async () => {
        if(user){
            await updateDoc(doc(db, 'userData', user.uid), {
                neighbor: '',
                school: userData?.school
            })
        }
        setChanged(!changed)
    }

    const didFetch = useRef(false)

    useEffect(() => {
        setLoading(true)
        if (didFetch.current) return
        didFetch.current = true

        const fetchSummary = async () => {
            const res = await fetch('/api/keyword')
            const data = await res.json()
            setSummary(data.summary)
            setLoading(false)
        }
        fetchSummary()
    }, [])

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
                userData?.neighbor == ''
                ?
                <div className='flex flex-col items-center justify-center pt-20 font-semi_bold space-y-10'>
                    <h1 className='text-3xl'>동네 설정이 필요합니다.</h1>
                    
                    <form className='flex flex-col space-y-3' onSubmit={handleSubmit(onValid)}>
                        <h1 className='text-xl'>동네 설정 하기</h1>
                        <select {...register('select')} className='border border-black border-opacity-20 px-20 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-instend'>
                            {
                                location.map((name, i) => <option key={i} value={name}>{name}</option>)
                            }
                        </select>
                        <button type='submit' className='px-20 py-2 bg-instend hover:brightness-90 text-white rounded-md transition-all'>저장하기</button>
                    </form>
                </div>
                :
                <div className='space-y-10'>
                    <div className='flex items-center space-x-5'>
                        <h1 className='text-2xl font-bold'>{userData?.neighbor}</h1>
                        <FontAwesomeIcon icon={faArrowsRotate} onClick={reset} className='w-6 h-6 opacity-50 hover:opacity-60 transition-all cursor-pointer' />
                    </div>
                    <div
                        className='px-8 rounded-md bg-[#DAD2E9] py-5 cursor-pointer flex items-center justify-between'
                        onClick={() => setOpened(!opened)}
                    >
                        {opened ? (
                        <div className='pr-5 space-y-4'>
                            <div>AI가 지난 일주일 동안의 인천광역시의 트렌드를 정리해봤어요.</div>
                            {
                            loading
                            ?
                            <div className='felx items-center justify-center text-center py-5'>
                                <p>요약중...</p>
                            </div>
                            :
                            <pre className='whitespace-pre-wrap font-regular'>{summary}</pre>
                            }
                        </div>
                        ) : (
                        <span>AI가 인천광역시의 최신 트렌드를 정리해봤어요 🔥</span>
                        )}
                        <div>
                        <FontAwesomeIcon icon={opened ? faChevronUp : faChevronDown} />
                        </div>
                    </div>
                    <div className='space-y-8'>
                        {
                            posts.map(postInfo => <Card key={postInfo.id} {...postInfo} folder={`neighbor${userData?.neighbor}`} />)
                        }
                    </div>
                    <WriteBtn query='neighbor' />
                </div>
            }
            <NavBar route='neighbor' />
        </div>
    )
}

export default Neighbor