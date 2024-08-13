import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Key } from 'react'

interface CardType {
    id?: Key
    title: string
    writer: string | null
    region: [string, string] // [~시, ~동]
    reaction: [number, number] // [heart, comment]
}

const Card = (props: CardType) => {
    return (
        <div key={props.id} className='border border-black border-opacity-20 px-8 rounded-md py-5 space-y-2'>
            <h1 className='font-bold text-xl'>{props.title}</h1>
            <div className='flex space-x-1'>
                <span className='text-instend'>{props.writer != null ? props.writer : '익명'}</span>
                <div className='text-black text-opacity-50'>&#183;</div>
                <span className='text-black text-opacity-50'>{`${props.region[0]} ${props.region[1]}`}</span>
            </div>
            <div className='flex space-x-8'>
                <div className='space-x-3 flex items-center'>
                    <FontAwesomeIcon icon={faHeart} className='w-5 h-5 text-[#FF4E4E]' />
                    <span>{props.reaction[0]}</span>
                </div>
                <div className='space-x-3 flex items-center'>
                    <FontAwesomeIcon icon={faComment} className='w-5 h-5' />
                    <span>{props.reaction[1]}</span>
                </div>
            </div>
        </div>
    )
}

export default Card