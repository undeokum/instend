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
                <div className='space-y-5'>
                    <div className='flex text-black text-opacity-50 space-x-1 text-lg'>
                        <div className='text-instend'>{postData?.userName}</div>
                        <div>&#183;</div>
                        <div>{postData?.createdAt}</div>
                    </div>
                    <h1 className='text-3xl font-bold'>{postData?.content}</h1>
                </div>
                <div className='items-center justify-center flex'>
                    <button className='flex items-center space-x-5 text-instend border-instend border py-2 rounded hover:bg-black hover:bg-opacity-5 transition-colors'>
                        <div className='flex items-center space-x-2 px-5 border-r border-instend'>
                            <FontAwesomeIcon icon={faHeart} className='w-5 h-5' />
                            <div>좋아요</div>
                        </div>
                        <div className='text-lg pr-5'>{postData?.heart}</div>
                    </button>
                </div>
            </div>
            <div className='border-b border-black border-opacity-20' />
            <form>
                <h1 className='text-2xl font-bold'>댓글</h1>
            </form>
        </div>
    )
}

export default Read