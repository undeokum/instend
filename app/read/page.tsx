'use client'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter, useSearchParams } from 'next/navigation'
import { db } from '../firebase'
import { useEffect, useState } from 'react'
import { PostInstructure } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as sHeart } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import NavBar from '@/components/nav'

interface CommentType {
    content: string
}

const Read = () => {
    const router = useRouter()
    const getFolder = useSearchParams().get('folder')
    const getID = useSearchParams().get('id')

    const [postData, setPostData] = useState<PostInstructure>()
    const { register } = useForm<CommentType>()

    const readDocInfo = async () => {
        const ref = doc(db, getFolder == '' ? 'all' : getFolder!, getID!)
        const docSnap = await getDoc(ref)
        if(docSnap.exists()){
            const {
                image,
                content,
                createdAt,
                heart,
                userId,
                userName,
                mm,
            } = docSnap.data()
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
        else {
            console.error('err')
        }
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
            <div className='space-y-10'>
                <h1 className='text-2xl font-bold'>댓글 (0)</h1>
                <form className='space-y-3'>
                    <textarea
                        {
                            ...register('content', {
                                required: '댓글을 입력해주세요.',
                                maxLength: {
                                    value: 30,
                                    message: '최대 30자 까지만 작성 가능합니다.'
                                }
                            })
                        }
                        placeholder='내용을 입력하세요.'
                        className='w-full border border-black border-opacity-20 px-5 pt-2 pb-16 rounded-md focus:ring-2 focus:ring-instend focus:outline-none resize-none'
                    />
                    <button type='submit' className='w-full py-1.5 text-lg text-white text-center bg-instend hover:bg-hover transition-colors rounded-md'>작성하기</button>
                </form>
                <div>
                    {
                        [...Array(5)].map((_, i) => (
                            <div key={i} className='w-full py-5 border-t space-y-5'>
                                <div className='space-y-1'>
                                    <div className='flex text-black text-opacity-50 space-x-1 text-lg'>
                                        <div className='text-instend'>{postData?.userName}</div>
                                        <div>&#183;</div>
                                        <div>{postData?.createdAt}</div>
                                    </div>
                                    <h1 className='text-xl'>ㅋㅋㅋㅋㅋ</h1>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <FontAwesomeIcon icon={sHeart} className='w-5 h-5 text-[#FF4E4E]' />
                                    <div>15</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <NavBar route='s' />
        </div>
    )
}

export default Read