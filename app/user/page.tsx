import Card from '@/components/card'
import NavBar from '@/components/nav'
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const User = () => {
    return (
        <div>
            <div className='space-y-16'>
                <div className='flex flex-col items-center space-y-8'>
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-12'>
                            <div className='w-24 h-24 bg-black bg-opacity-10 rounded-full flex items-center justify-center'>
                                <FontAwesomeIcon icon={faUser} className='h-8 w-8 opacity-40' />
                            </div>
                            <div className='space-y-2 text-lg'>
                                <p className='opacity-50 text-lg'>@chul.su_kim</p>
                                <h1 className='text-3xl font-semi_bold'>김철수</h1>
                            </div>
                        </div>
                        <div className='flex space-x-2 text-black text-opacity-50 justify-center items-center'>
                            <span>서울특별시 대치동</span>
                            <div>&#183;</div>
                            <span>휘문고등학교</span>
                        </div>
                    </div>
                    <button className='bg-instend text-white w-[52%] py-1 rounded-md text-lg'>내 정보 수정하기</button>
                </div>
                <div className='space-y-5 px-10'>
                    <h1 className='text-2xl font-semi_bold'>내가 작성한 글들</h1>
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
                        <NavBar route='school' />
                    </div>
                </div>
            </div>
            <NavBar route='user' />
        </div>
    )
}

export default User