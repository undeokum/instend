import { faArrowsRotate, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NavBar from '@/components/nav'
import Card from '@/components/card'

const Neighbor = () => {
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
            <div className='flex items-center space-x-5'>
                <h1 className='text-2xl font-bold'>서울특별시 삼성동</h1>
                <FontAwesomeIcon icon={faArrowsRotate} className='w-6 h-6 opacity-50 hover:opacity-60 transition-all' />
            </div>
            <div className='space-y-8'>
                {
                    [...Array(50)].map((_, i) => (
                        <Card
                            key={i}
                            title='내일 위버스콘 가시는 분 계신가요??'
                            writer={null}
                            region={['서울특별시', '대치동']}
                            reaction={[4, 15]}    
                        />
                    ))
                }
            </div>
            <NavBar route='neighbor' />
        </div>
    )
}

export default Neighbor