'use client'
import { useForm } from 'react-hook-form'
import { auth } from '../firebase'
import NavBar from '@/components/nav'
import { useEffect, useState } from 'react'
import { updateEmail, updatePassword, updateProfile, User } from 'firebase/auth'
import { useRouter } from 'next/navigation'

interface FormType {
    email: string
    name: string
    password_new: string
}

const Edit = () => {
    const { register, setValue, watch, formState: { errors }, handleSubmit } = useForm<FormType>()

    const router = useRouter()

    const [user, setUser] = useState<User | null>(null)
    const [firstValues, setFirstValues] = useState<string[]>([])
    const [changed, setChanged] = useState(false)

    const email = watch('email')
    const name = watch('name')
    const password_new = watch('password_new')

    const onValid = async () => {
        if(user){
            await updateEmail(user, email)
            await updateProfile(user, {
                displayName: name
            })
            if(password_new != '') await updatePassword(user, password_new)
        }
        router.push('/user')
    }

    useEffect(() => {
        const userSet = auth.onAuthStateChanged(user => {
            setUser(user)
        })
        
        return () => userSet()
    }, [])
    useEffect(() => {
        if (user) {
            setValue('email', user.email || '')
            setValue('name', user.displayName || '')
        }
        setFirstValues([user?.email || '', user?.displayName || '', ''])
    }, [user])
    useEffect(() => {
        if (user) {
            const currentValues = [email, name, password_new]
            const allValuesMatch = currentValues.every((value, i) => value == firstValues[i])

            setChanged(!allValuesMatch)
        }
    }, [email, name, password_new, firstValues, user])
    return (
        <div>
            <form className='space-y-5' onSubmit={handleSubmit(onValid)}>
                <div className='space-y-1'>
                    <p className='text-lg'>이메일</p>
                    <input
                        {
                            ...register('email',
                                {
                                    required: '이메일을 입력해주세요.',
                                    pattern: {
                                        value:
                                            /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/i,
                                        message: '이메일 형식에 맞지 않습니다.',
                                    },
                                }
                            )
                        }
                        type='text'
                        className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none'
                    />
                    <span className='text-red-600'>{errors.email?.message}</span>
                </div>
                <div className='space-y-1'>
                    <p className='text-lg'>이름</p>
                    <input
                        {
                            ...register('name', {
                                required: '이름을 입력해주세요.',
                                minLength: {
                                    value: 2,
                                    message: '이름은 2글자 이상이여야 합니다.'
                                },
                                maxLength: {
                                    value: 6,
                                    message: '이름은 6글자 이하여야 합니다.'
                                },
                                pattern: {
                                    value: /^[가-힣]{2,4}$/,
                                    message: '본명을 입력해주세요.'
                                }
                            }
                        )
                        }
                        type='text'
                        className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none'
                    />
                    <span className='text-red-600'>{errors.name?.message}</span>
                </div>
                <div className='space-y-1'>
                    <p className='text-lg'>새로운 비밀번호</p>
                    <input
                        {
                            ...register('password_new', {
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/,
                                      message: '영문, 숫자, 특수문자 포함 8 ~ 20자로 입력해주세요'
                                },
                            }
                        )
                        }
                        type='password'
                        className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none'
                    />
                    <span className='text-red-600'>{errors.password_new?.message}</span>
                </div>
                <button type={changed ? 'submit' : 'button'} className={`w-full py-1.5 text-lg text-white text-center bg-instend transition-colors rounded-md ${changed ? 'hover:bg-hover' : 'opacity-60 cursor-not-allowed'}`}>정보 수정</button>
            </form>
            <NavBar route='s' />
        </div>
    )
}

export default Edit