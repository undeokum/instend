'use client'
import { PostInstructure } from '@/app'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

const Card = (props: PostInstructure) => {
    const router = useRouter()
    const path = usePathname()
    return (
        <div className='border border-black border-opacity-20 px-8 rounded-md py-5 flex justify-between cursor-pointer hover:bg-black hover:bg-opacity-5 transition-opacity' onClick={() => router.push(`/read?folder=${path.slice(1, path.length)}&id=${props.id}`)}>
            <div className='space-y-3'>
                <h1 className='font-bold text-xl'>{props.content}</h1>
                <div className='flex space-x-1'>
                    <span className='text-instend'>{props.userName}</span>
                    <div className='text-black text-opacity-50'>&#183;</div>
                    <span className='text-black text-opacity-50'>{props.createdAt}</span>
                </div>
                <div className='flex space-x-8'>
                    <div className='space-x-3 flex items-center'>
                        <FontAwesomeIcon icon={faHeart} className='w-5 h-5 text-instend_red' />
                        <span>{props.heart}</span>
                    </div>
                    <div className='space-x-3 flex items-center'>
                        <FontAwesomeIcon icon={faComment} className='w-5 h-5' />
                        <span>15</span>
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