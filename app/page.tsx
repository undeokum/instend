import { faHeart, faSearch } from '@fortawesome/free-solid-svg-icons'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavBar from '@/components/nav'

const Home = () => {
    return (
        <div className='space-y-10'>
            <div className='relative'>
                <div className='absolute top-3 left-4'>
                    <FontAwesomeIcon icon={faSearch} className='w-4 h-4 text-black opacity-50' />
                </div>
                <input
                    type='text'
                    placeholder='검색어를 입력하세요.'
                    className='bg-black bg-opacity-10 placeholder:text-black placeholder:opacity-50 w-full py-2 pl-12 pr-5 rounded-full focus:outline-none focus:ring-2 focus:ring-instend'
                />
            </div>
            <div className='space-y-8'>
                {
                    [...Array(50)].map((_, i) => (
                        <div key={i} className='border border-black border-opacity-20 px-8 rounded-md py-5 space-y-2'>
                            <h1 className='font-bold text-xl'>내일 위버스콘 가시는 분 계신가요??</h1>
                            <div className='flex space-x-1'>
                                <span className='text-instend'>익명</span>
                                <div className='text-black text-opacity-50'>&#183;</div>
                                <span className='text-black text-opacity-50'>서울특별시 삼성동</span>
                            </div>
                            <div className='flex space-x-8'>
                                <div className='space-x-3 flex items-center'>
                                    <FontAwesomeIcon icon={faHeart} className='w-5 h-5 text-[#FF4E4E]' />
                                    <span>4</span>
                                </div>
                                <div className='space-x-3 flex items-center'>
                                    <FontAwesomeIcon icon={faComment} className='w-5 h-5' />
                                    <span>15</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <NavBar route='' />
        </div>
    )
}

export default Home