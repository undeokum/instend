'use client'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavBar from '@/components/nav'
import Card from '@/components/card'
import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { PostInstructure } from '..'
import WriteBtn from '@/components/write-btn'
import SearchBar from '@/components/search'

const Neighbor = () => {
    const [posts, setPosts] = useState<PostInstructure[]>([])
    const fetchPosts = async () => {
        const postsQuery = query(
            collection(db, 'neighbor'),
            orderBy('mm', 'desc')
        )
        const snapshop = await getDocs(postsQuery)
        const posts = snapshop.docs.map(doc => {
            const {
                image,
                content,
                createdAt,
                heart,
                userId,
                userName,
                mm,
            } = doc.data()
            return {
                image,
                content,
                createdAt,
                heart,
                userId,
                userName,
                mm,
                id: doc.id
            }
        })
        setPosts(posts)
    }
    useEffect(() => {
        fetchPosts()
    }, [])
    return (
        <div className='space-y-10'>
            <SearchBar />
            <div className='flex items-center space-x-5'>
                <h1 className='text-2xl font-bold'>서울특별시 삼성동</h1>
                <FontAwesomeIcon icon={faArrowsRotate} className='w-6 h-6 opacity-50 hover:opacity-60 transition-all' />
            </div>
            <div className='space-y-8'>
                {
                    posts.map(postInfo => <Card key={postInfo.id} {...postInfo} />)
                }
            </div>
            <WriteBtn query='neighbor' />
            <NavBar route='neighbor' />
        </div>
    )
}

export default Neighbor