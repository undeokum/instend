'use client'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter, useSearchParams } from 'next/navigation'
import { db } from '../firebase'
import { useEffect, useState } from 'react'
import { PostInstructure } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'

const Read = () => {
    const router = useRouter()
    const getFolder = useSearchParams().get('folder')
    const getID = useSearchParams().get('id')

    const [postData, setPostData] = useState<PostInstructure>()

    const readDocInfo = async () => {
        const ref = doc(db, getFolder == '' ? 'all' : getFolder!, getID!)
        const docSnap = await getDoc(ref)
        const data = {...docSnap.data()}
        const {
            image,
            content,
            createdAt,
            heart,
            userId,
            userName,
            mm,
        } = data
        setPostData({
            image,
            content,
            createdAt,
            heart,
            userId,
            userName,
            mm,
            id: getID!
        })
    }
    useEffect(() => {
        readDocInfo()
    })
    return (
        <div className='space-y-10'>
            <div className='space-y-16'>
                <h1 className='text-3xl font-bold'>{postData?.content}</h1>
                <div className='space-y-3'>
                    <div className='flex text-black text-opacity-50 space-x-1 text-lg'>
                        <div className='text-instend'>{postData?.userName}</div>
                        <div>&#183;</div>
                        <div>{postData?.createdAt}</div>
                    </div>
                    <div className='flex space-x-2 items-center'>
                        <FontAwesomeIcon icon={faHeart} className='w-6 h-6' />
                        <div className='text-lg'>{postData?.heart}</div>
                    </div>
                </div>
            </div>
            <div className='border-b border-black border-opacity-20' />
        </div>
    )
}

export default Read