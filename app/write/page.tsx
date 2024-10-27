'use client'
import NavBar from '@/components/nav'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { auth, db, storage } from '../firebase'
import React, { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Image from 'next/image'
import { FOLDER } from '../folder'
import { UserDataInstructure } from '..'

interface PostType {
    content: string
    image: FileList
    select: string
}

const Write = () => {
    const router = useRouter()
    const searchParams = useSearchParams().get('where')
    const { register, formState: { errors }, handleSubmit, watch } = useForm<PostType>()
    const image = watch('image')

    const [user, setUser] = useState<User | null>(null)
    const [posting, setPosting] = useState(false)
    const [imgURL, setImgURL] = useState('')
    const [userData, setUserData] = useState<UserDataInstructure>()

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

    const onValid = async (data: PostType) => {
        if(!posting && user){
            setPosting(true)
            const content = data.content
            const img = data.image && data.image.length == 1 ? data.image[0] : null
            const select = data.select
            const date = new Date()
            const doc = await addDoc(collection(db, searchParams != 'neighbor' ? (searchParams != 'school' ? searchParams! : `school${userData?.school}`) : `neighbor${userData?.neighbor}`), {
                content,
                createdAt: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
                anon: select == 'anon' ? true : false,
                userId: user?.uid,
                mm: Date.now()
            })
            if(img != null) {
                console.log(img)
                const locationRef = ref(storage, `${searchParams!}/${user!.uid}/${doc.id}`)
                const result = await uploadBytes(locationRef, img)
                const url = await getDownloadURL(result.ref)
                await updateDoc(doc, {image: url,})
            }
            router.push(`/${searchParams == 'all' ? '' : searchParams}`)
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user)
        })
        
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if(user) fetchUserData()
    }, [user])

    useEffect(() => {
        if(!FOLDER.includes(searchParams!)) router.push('/write?where=all')
        if(image && image.length > 0) setImgURL(URL.createObjectURL(image[0]))
    }, [searchParams, image])

    return (
        <div className='space-y-5'>
            <div className='flex justify-between'>
                <button onClick={() => router.push(`/${searchParams == 'all' ? '' : searchParams}`)}>
                    <FontAwesomeIcon icon={faChevronLeft} className='w-6 h-6 opacity-50 hover:bg-black hover:bg-opacity-10 p-2.5 rounded-full' />
                </button>
                <select
                    {...register('select')}
                    className='border border-black border-opacity-20 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-instend'
                >
                    <option value='anon'>익명</option>
                    <option value='name'>{user?.displayName}</option>
                </select>
            </div>
            <form className='flex flex-col space-y-5' onSubmit={handleSubmit(onValid)}>
                <textarea
                    {
                        ...register('content', {
                            required: '내용을 입력해주세요.',
                            minLength: {
                                value: 5,
                                message: '최소 5자는 입력해야합니다.'
                            },
                            maxLength: {
                                value: 50,
                                message: '최대 50자 까지만 작성 가능합니다.'
                            }
                        })
                    }
                    placeholder='내용을 입력하세요.'
                    className='w-full border border-black border-opacity-20 px-5 pt-2 pb-32 rounded-md focus:ring-2 focus:ring-instend focus:outline-none resize-none'
                />
                <span className='text-red-600'>{errors.content?.message}</span>
                <div className='flex'>
                    <input
                        {
                            ...register('image')
                        }
                        type='file'
                        accept='image/*'
                        className='hidden'
                        id='file'
                    />
                    <label htmlFor='file' className='text-instend border border-instend px-5 py-2 rounded-md bg-white hover:bg-black hover:bg-opacity-5'>이미지 업로드</label>
                </div>
                <div>
                    {
                        image && image.length > 0
                        &&
                        <Image src={imgURL} alt='preview' width={100} height={100} className='h-52 w-auto border border-black border-opacity-20 rounded-md' />
                    }
                </div>
                <button type='submit' className='w-full py-1.5 text-lg text-white text-center bg-instend hover:bg-hover transition-colors rounded-md'>작성하기</button>
            </form>
            <NavBar route='un' />
        </div>
    )
}

export default Write