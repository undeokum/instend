'use client'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { useSearchParams } from 'next/navigation'
import { auth, db } from '../firebase'
import { useCallback, useEffect, useState } from 'react'
import { HeartInstructure, PostInstructure } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as sHeart } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import NavBar from '@/components/nav'
import Image from 'next/image'
import { FOLDER } from '../folder'
import { User } from 'firebase/auth'

interface CommentType {
    content: string
    select: string
}

const Read = () => {
    const getFolder = useSearchParams().get('folder')
    const getID = useSearchParams().get('id')

    const [postData, setPostData] = useState<PostInstructure>()
    const { register, handleSubmit, reset } = useForm<CommentType>()

    const [notFound, setNotFound] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [posting, setPosting] = useState(false)
    const [commentData, setCommentData] = useState<PostInstructure[]>([])
    const [heartData, setHeartData] = useState<HeartInstructure[]>([])
    const [commentHeartData, setCommentHeartData] = useState<HeartInstructure[]>([])
    const [heart, setHeart] = useState(false)
    const [commentHeart, setCommentHeart] = useState(false)
    const [commentID, setCommentID] = useState('')

    const readDocInfo = useCallback(async () => {
        const ref = doc(db, getFolder!, getID!)
        const docSnap = await getDoc(ref)
        if(FOLDER.includes(getFolder!)){
            if(docSnap.exists()){
                const {
                    image,
                    content,
                    createdAt,
                    userId,
                    userName,
                    mm,
                } = docSnap.data()
                setPostData({
                    image,
                    content,
                    createdAt,
                    userId,
                    userName,
                    mm,
                    id: getID!
                })
            }
            else {
                setNotFound(true)
            }
        }
        else {
            setNotFound(true)
        }
    }, [getFolder, getID])

    const fetchComments = useCallback(async () => {
        const postsQuery = query(
            collection(db, getFolder!, getID!, 'comments'),
            orderBy('mm', 'desc')
        )
        const snapshop = await getDocs(postsQuery)
        const comments = snapshop.docs.map(doc => {
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
        setCommentData(comments)
    }, [getFolder, getID])

    const fetchHearts = useCallback(async () => {
        const heartsQuery = query(
            collection(db, getFolder!, getID!, 'hearts')
        )
        const snapshop = await getDocs(heartsQuery)
        const hearts = snapshop.docs.map(doc => {
            const { userId } = doc.data()
            return { userId, id: doc.id }
        })
        setHeartData(hearts)
        setHeart(hearts.some(heartInfo => heartInfo.userId == user?.uid))
    }, [user, getFolder, getID])

    const fetchCommentHearts = useCallback(async () => {
        if(commentID) {
            const heartsQuery = query(
                collection(db, getFolder!, getID!, 'comments', commentID, 'hearts')
            )
            const snapshop = await getDocs(heartsQuery)
            const hearts = snapshop.docs.map(doc => {
                const { userId } = doc.data()
                return { userId, id: doc.id }
            })
            setCommentHeartData(hearts)
            setCommentHeart(hearts.some(heartInfo => heartInfo.userId == user?.uid))
        }
    }, [user, getFolder, getID, commentID])

    const onValid = async (data: CommentType) => {
        if(!posting) {
            setPosting(true)
            const date = new Date()
            await addDoc(collection(db, getFolder!, getID!, 'comments'), {
                content: data.content,
                createdAt: `${date.getFullYear()}-${date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`,
                userName: data.select == 'anon' ? '익명' : user?.displayName,
                userId: user?.uid,
                heart: 0,
                mm: Date.now()
            })
            reset({content: ''})
        }
    }

    const Heart = async () => {
        if(heart){
            const heartId = heartData.find(heartInfo => heartInfo.userId === user?.uid)?.id
            await deleteDoc(doc(db, getFolder!, getID!, 'hearts', heartId!))
            setHeart(false)
        }
        else {
            await addDoc(collection(db, getFolder!, getID!, 'hearts'), {
                userId: user?.uid
            })
            setHeart(true)
        }
    }

    const CommentHeart = async () => {
        if(commentHeart){
            const heartId = commentHeartData.find(heartInfo => heartInfo.userId === user?.uid)?.id
            await deleteDoc(doc(db, getFolder!, getID!, 'comments', commentID, 'hearts', heartId!))
            setCommentHeart(false)
        }
        else {
            await addDoc(collection(db, getFolder!, getID!, 'comments', commentID, 'hearts'), {
                userId: user?.uid
            })
            setCommentHeart(true)
        }
    }

    useEffect(() => {
        setUser(auth.currentUser)
        readDocInfo()
        fetchComments()
        fetchHearts()
    }, [readDocInfo, fetchComments, fetchHearts])

    useEffect(() => {
        if (commentData.length > 0) {
            setCommentID(commentData[0].id)
        }
    }, [commentData])

    useEffect(() => {
        fetchCommentHearts()
    }, [fetchCommentHearts])
    return (
        <div>
            {
                notFound
                ?
                <div className='flex flex-col items-center justify-center space-y-3'>
                    <h1 className='text-7xl font-bold text-instend'>404</h1>
                    <h1 className='text-3xl font-medium'>게시글을 찾을 수 없습니다.</h1>
                </div>
                :
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
                        <div>
                            {
                                postData?.image
                                &&
                                <Image src={postData?.image} alt='image' width={100} height={100} className='h-52 w-auto border border-black border-opacity-20 rounded-md' />
                            }
                        </div>
                        <div className='items-center justify-center flex'>
                            <button className={`flex items-center space-x-4 px-5 py-2 rounded transition-colors border border-instend_red ${heart ? 'text-white bg-instend_red hover:brightness-90 transition-all' : 'text-instend_red hover:bg-black hover:bg-opacity-5'}`} onClick={Heart}>
                                <FontAwesomeIcon icon={heart ? sHeart : faHeart} className='w-5 h-5' />
                                <div className='text-lg'>{heartData.length}</div>
                            </button>
                        </div>
                    </div>
                    <div className='border-b border-black border-opacity-20' />
                    <div className='space-y-10'>
                        <div className='flex justify-between'>
                            <h1 className='text-2xl font-semi_bold'>댓글 ({commentData.length})</h1>
                            <select
                                {...register('select')}
                                className='border border-black border-opacity-20 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-instend'
                            >
                                <option value='anon'>익명</option>
                                <option value='name'>{user?.displayName}</option>
                            </select>
                        </div>
                        <form className='space-y-3' onSubmit={handleSubmit(onValid)}>
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
                                commentData.map(commentInfo => (
                                    <div key={commentInfo.id} className='w-full py-5 border-t space-y-5'>
                                        <div className='space-y-1'>
                                            <div className='flex text-black text-opacity-50 space-x-1 text-lg'>
                                                <div className='text-instend'>{commentInfo.userName}</div>
                                                <div>&#183;</div>
                                                <div>{commentInfo.createdAt}</div>
                                            </div>
                                            <h1 className='text-xl'>{commentInfo.content}</h1>
                                        </div>
                                        <div className='flex items-center space-x-3' onClick={CommentHeart}>
                                            <FontAwesomeIcon icon={commentHeart ? sHeart : faHeart} className='w-5 h-5 text-instend_red' />
                                            <div>15</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }
            <NavBar route='s' />
        </div>
    )
}

export default Read