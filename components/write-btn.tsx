import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

interface BtnType {
    query: string
}

const WriteBtn = (props: BtnType) => {
    return (
        <div className='fixed bottom-32 right-0 max-w-screen-sm w-full z-50 flex'>
            <Link href={`/write?where=${props.query}`} className='p-5 rounded-full text-white bg-instend hover:bg-hover transition-colors flex items-center justify-center shadow-md'>
                <FontAwesomeIcon icon={faPenToSquare} className='w-5 h-5' />
            </Link>
        </div>
    )
}

export default WriteBtn