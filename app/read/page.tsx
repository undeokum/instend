'use client'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useSearchParams } from 'next/navigation'
import { auth, db } from '../firebase'
import { Suspense, useEffect, useState } from 'react'
import { HeartInstructure, PostInstructure, UserDataInstructure } from '..'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as sHeart } from '@fortawesome/free-solid-svg-icons'
import { useForm } from 'react-hook-form'
import NavBar from '@/components/nav'
import Image from 'next/image'
import { FOLDER } from '../folder'
import { User } from 'firebase/auth'
import Heart from '@/utils/heart'

interface CommentType {
    content: string
    select: string
}

const Read = () => {
    const getID = useSearchParams().get('id')
    const folderName = useSearchParams().get('folder')

    const [postData, setPostData] = useState<PostInstructure>()
    const { register, handleSubmit, reset, setValue } = useForm<CommentType>()

    const [notFound, setNotFound] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [commentData, setCommentData] = useState<PostInstructure[]>([])
    const [hearts, setHearts] = useState<HeartInstructure[] | null>(null)
    const [userData, setUserData] = useState<UserDataInstructure>()
    const [loading, setLoading] = useState(false)

    const getFolder = folderName == 'neighbor' ? `neighbor${userData?.neighbor}` : folderName

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

    const readDocInfo = async () => {
        if(userData && getFolder){
            const ref = doc(db, getFolder, getID!)
            const docSnap = await getDoc(ref)
            if(FOLDER.includes(getFolder.startsWith('neighbor') ? 'neighbor' : getFolder)){
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
        }
    }

    const fetchComments = async () => {
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
    }

    const onValid = async (data: CommentType) => {
        if(!loading){
            setValue('content', '')
            setLoading(true)
            if(userData) {
                const date = new Date()
                await addDoc(collection(db, getFolder!, getID!, 'comments'), {
                    content: data.content,
                    createdAt: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
                    userName: `${data.select == 'anon' ? '익명' : user?.displayName}${user?.uid == postData?.userId ? '(글쓴이)' : ''}`,
                    userId: user?.uid,
                    heart: 0,
                    mm: Date.now()
                })
                reset({content: ''})
            }
            setLoading(false)
        }
    }

    const postHeart = new Heart(getID!, hearts, setHearts, user)

    const deleteComment = async (commentId: string) => {
        if(!loading && postData){
            setLoading(true)
            if(confirm('댓글을 삭제하시겠습니까?')){
                await deleteDoc(doc(db, getFolder!, postData.id, 'comments', commentId))
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        const userSet = auth.onAuthStateChanged(userr => {
            setUser(userr)
        })
        
        return () => userSet()
    }, [])

    useEffect(() => {
        if(user){
            fetchUserData()
        }
    }, [user])

    useEffect(() => {
        readDocInfo()
        postHeart.countHearts()
    }, [userData])
    useEffect(() => {
        fetchComments()
    }, [loading])
    return (
        <Suspense>
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
                            <button onClick={postHeart.heartChange} className={`flex items-center space-x-4 px-5 py-2 rounded transition-colors border border-instend_red ${postHeart.heartCheck ? 'text-white bg-instend_red hover:brightness-90 transition-all' : 'text-instend_red hover:bg-black hover:bg-opacity-5'}`}>
                                <FontAwesomeIcon icon={postHeart.heartCheck ? sHeart : faHeart} className='w-5 h-5' />
                                <div className='text-lg'>{hearts?.length}</div>
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
                        <div className='border-b'>
                            {
                                commentData.map(commentInfo => (
                                    <div key={commentInfo.id} className='w-full py-5 border-t space-y-1'>
                                        <div className='flex items-center justify-between text-black text-opacity-50 text-lg'>
                                            <div className='flex space-x-1'>
                                                <div className='text-instend'>{commentInfo.userName}</div>
                                                <div>&#183;</div>
                                                <div>{commentInfo.createdAt}</div>
                                            </div>
                                            {
                                                commentInfo.userId == user?.uid
                                                &&
                                                <div onClick={() => deleteComment(commentInfo.id)} className='cursor-pointer hover:underline'>삭제</div>
                                            }
                                        </div>
                                        <h1 className='text-xl'>{commentInfo.content}</h1>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            }
            <NavBar route='s' />
        </Suspense>
    )
}

export default Read