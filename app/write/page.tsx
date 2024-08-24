'use client'
import NavBar from '@/components/nav'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addDoc, collection } from 'firebase/firestore'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { auth, db, storage } from '../firebase'
import React, { useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { ref, uploadBytes } from 'firebase/storage'

interface PostType {
    content: string
    image: FileList
    select: string
}

const params = ['', 'school', 'neighbor']

const Write = () => {
    const router = useRouter()
    const searchParams = useSearchParams().get('where')
    const { register, formState: { errors }, handleSubmit } = useForm<PostType>()
    const [user, setUser] = useState<User | null>(null)
    const [posting, setPosting] = useState(false)

    useEffect(() => {
        setUser(auth.currentUser)
        if(!params.includes(searchParams!)) router.push('/write?where=')
    }, [router, searchParams])

    const onValid = async (data: PostType) => {
        if(!posting){
            setPosting(true)
            const content = data.content
            const img = data.image && data.image.length == 1 ? data.image[0] : null
            const select = data.select
            const date = new Date()
            const setFolder = searchParams == '' ? 'all' : searchParams!
            const doc = await addDoc(collection(db, setFolder), {
                content,
                createdAt: `${date.getFullYear()}-${date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`,
                userName: select == 'anon' ? '익명' : user?.displayName,
                userId: user?.uid,
                heart: 0
            })
            if(img != null) {
                console.log(img)
                const locationRef = ref(storage, `${setFolder}/${user!.uid}/${doc.id}`)
                await uploadBytes(locationRef, img)
            }
            router.push(`/${searchParams}`)
        }
    }
    return (
        <div className='space-y-5'>
            <div className='flex justify-between'>
                <button onClick={() => router.push(`/${searchParams}`)}>
                    <FontAwesomeIcon icon={faChevronLeft} className='w-6 h-6 opacity-50 hover:bg-black hover:bg-opacity-10 p-2.5 rounded-full' />
                </button>
                <select
                    {...register('select')}
                    name='anonable'
                    id='anonable'
                    className='border border-black border-opacity-20 px-5 rounded-md focus:outline-none focus:ring-2 focus:ring-instend'
                >
                    <option value='anon'>익명</option>
                    <option value='name'>{auth.currentUser?.displayName}</option>
                </select>
            </div>
            <form className='flex flex-col space-y-5' onSubmit={handleSubmit(onValid)}>
                <textarea
                    {
                        ...register('content', {
                            required: '내용을 입력해주세요.',
                            minLength: {
                                value: 10,
                                message: '최소 10자는 입력해야합니다.'
                            },
                            maxLength: {
                                value: 200,
                                message: '최대 200자 까지만 작성 가능합니다.'
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
                <button type='submit' className='w-full py-1.5 text-lg text-white text-center bg-instend hover:bg-hover transition-colors rounded-md'>작성하기</button>
            </form>
            <NavBar route='un' />
        </div>
    )
}

export default Write