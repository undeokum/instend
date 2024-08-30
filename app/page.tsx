'use client'
import NavBar from '@/components/nav'
import Card from '@/components/card'
import WriteBtn from '@/components/write-btn'
import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'
import { PostInstructure } from '.'
import SearchBar from '@/components/search'

const Home = () => {
    const [posts, setPosts] = useState<PostInstructure[]>([])
    const fetchPosts = async () => {
        const postsQuery = query(
            collection(db, 'all'),
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
    useEffect(() => {
        fetchPosts()
    }, [])
    return (
        <div className='space-y-10'>
            <SearchBar />
            <div className='space-y-8'>
                {
                    posts.map(postInfo => <Card key={postInfo.id} {...postInfo} folder='all' />)
                }
            </div>
            <WriteBtn query='' />
            <NavBar route='' />
        </div>
    )
}

export default Home