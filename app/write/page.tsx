'use client'
import NavBar from '@/components/nav'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

interface PostType {
    content: string
}

const Write = () => {
    const router = useRouter()
    const { register, formState: { errors } } = useForm<PostType>()
    return (
        <div className='space-y-5'>
            <button onClick={() => router.back()}>
                <FontAwesomeIcon icon={faChevronLeft} className='w-6 h-6 opacity-50 hover:bg-black hover:bg-opacity-10 p-2.5 rounded-full' />
            </button>
            <form className='flex flex-col space-y-5'>
                <textarea
                    {
                        ...register('content', {
                            required: '내용을 입력해주세요.',
                            minLength: {
                                value: 15,
                                message: '최소 15자는 입력해야합니다.'
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
                    <input type='file' accept='image/*' className='hidden' id='file' />
                    <label htmlFor='file' className='text-instend border border-instend px-5 py-2 rounded-md bg-white hover:bg-black hover:bg-opacity-5'>이미지 업로드</label>
                </div>
                <button type='submit' className='w-full py-1.5 text-lg text-white text-center bg-instend hover:bg-hover transition-colors rounded-md'>작성하기</button>
            </form>
            <NavBar route='un' />
        </div>
    )
}

export default Write