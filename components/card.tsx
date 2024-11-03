'use client'
import { HeartInstructure, PostInstructure } from '@/app'
import { auth, db } from '@/app/firebase'
import Heart from '@/utils/heart'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faHeart as rHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { collection, getDocs, query } from 'firebase/firestore'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface ReadType extends PostInstructure {
    folder: string
}

const Card = (props: ReadType) => {
    const router = useRouter()
    const setCollection = `${props.folder}/${props.id}`
    const user = auth.currentUser

    const [hearts, setHearts] = useState<HeartInstructure[] | null>(null)
    const [commentData, setCommentData] = useState<PostInstructure[]>([])

    const fetchComments = useCallback(async () => {
        const postsQuery = query(collection(db, `${setCollection}/comments`))
        const snapshop = await getDocs(postsQuery)
        const comments = snapshop.docs.map(doc => {
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
        setCommentData(comments)
    }, [setCollection])

    const heart = new Heart(props.id, hearts, setHearts, user)

    useEffect(() => {
        fetchComments()
        heart.countHearts()
    }, [])
    return (
        <div className='border border-black border-opacity-20 px-8 rounded-md py-5 flex justify-between cursor-pointer hover:bg-black hover:bg-opacity-5 transition-opacity' onClick={() => router.push(`/read?folder=${props.folder}&id=${props.id}`)}>
            <div className='space-y-3'>
                <h1 className='font-medium text-xl'>{props.content.length > 20 ? `${props.content.slice(0, 20)}...` : props.content}</h1>
                <div className='flex space-x-1'>
                    <span className='text-instend'>{props.userName}</span>
                    <div className='text-black text-opacity-50'>&#183;</div>
                    <span className='text-black text-opacity-50'>{props.createdAt}</span>
                </div>
                <div className='flex space-x-8'>
                    <div className='space-x-3 flex items-center'>
                        <FontAwesomeIcon icon={heart.heartCheck ? faHeart : rHeart} className='w-5 h-5 text-instend_red' />
                        <span>{hearts?.length}</span>
                    </div>
                    <div className='space-x-3 flex items-center'>
                        <FontAwesomeIcon icon={faComment} className='w-5 h-5' />
                        <span>{commentData.length}</span>
                    </div>
                </div>
            </div>
            {
                props.image &&
                <div className='flex flex-col items-center justify-center relative w-24 h-24'>
                    <Image src={props.image} width={100} height={100} alt='image' className='rounded-md border border-black border-opacity-20 absolute top-0 left-0 w-full h-full object-cover' />
                </div>
            }
        </div>
    )
}

export default Card