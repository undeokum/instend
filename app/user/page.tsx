'use client'
import Card from '@/components/card'
import NavBar from '@/components/nav'
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { auth } from '../firebase'
import { useEffect, useState } from 'react'
import SearchBar from '@/components/search'
import { useForm } from 'react-hook-form'

interface RadioType {
    folder: string
}

const User = () => {
    const { register } = useForm<RadioType>()
    const [name, setName] = useState<string | null>()
    useEffect(() => {
        setName(auth.currentUser?.displayName)
    }, [])
    return (
        <div>
            <div className='space-y-16'>
                <div className='flex flex-col items-center space-y-8 border border-black border-opacity-20 w-full py-10 rounded-md'>
                    <div className='space-y-4'>
                        <div className='space-y-2 text-lg text-center'>
                            <h1 className='text-4xl font-semi_bold'>{name}</h1>
                        </div>
                        <div className='flex space-x-2 text-black text-opacity-50 justify-center items-center'>
                            <span>서울특별시 대치동</span>
                            <div>&#183;</div>
                            <span>휘문고등학교</span>
                        </div>
                    </div>
                    <button className='bg-instend hover:bg-hover transition-colors text-white w-[52%] py-1.5 rounded-md text-lg'>내 정보 수정하기</button>
                </div>
                <div className='space-y-5'>
                    <h1 className='text-2xl font-semi_bold'>내가 작성한 글들</h1>
                    <div className='space-y-10'>
                        <SearchBar />
                        <div className='flex items-center space-x-16'>
                            <label>
                                <input
                                    {
                                        ...register('folder')
                                    }
                                    checked
                                    type='radio'
                                    value='all'
                                    id='radio'
                                    className='hidden'
                                />
                                <div className={`flex items-center justify-center rounded-full checked:bg-instend chcked:text-white checked:border-instend hover:brightness-90 transition-all bg-white text-black border border-black border-opacity-20 px-5 py-2 text-lg`}>전체</div>
                            </label>
                            <label>
                                <input
                                    {
                                        ...register('folder')
                                    }
                                    type='radio'
                                    value='neighbor'
                                    id='radio'
                                    className='hidden'
                                />
                                <div className={`flex items-center justify-center rounded-full checked:bg-instend chcked:text-white checked:border-instend hover:brightness-90 transition-all bg-white text-black border border-black border-opacity-20 px-5 py-2 text-lg`}>동네</div>
                            </label>
                            <label>
                                <input
                                    {
                                        ...register('folder')
                                    }
                                    type='radio'
                                    value='school'
                                    id='radio'
                                    className='hidden'
                                />
                                <div className={`flex items-center justify-center rounded-full checked:bg-instend chcked:text-white checked:border-instend hover:brightness-90 transition-all bg-white text-black border border-black border-opacity-20 px-5 py-2 text-lg`}>학교</div>
                            </label>
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