'use client'
import { auth } from '@/app/firebase'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { ErrorCode, ErrorMessage } from '../error-code'

interface SignUpFormType {
    email: string
    name: string
    password: string
    passwordRE: string
}

const SignUp = () => {
    const router = useRouter()
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/')
            }
        })
    }, [auth])
    const [error, setError] = useState('')
    const { register, handleSubmit, watch,formState: { errors } } = useForm<SignUpFormType>()
    const onValid = async (data: SignUpFormType) => {
        try {
            const credentials = await createUserWithEmailAndPassword(auth, data.email, data.password)
            console.log(credentials.user)
            await updateProfile(credentials.user, {
                displayName: data.name
            })
            router.push('/')
        }
        catch(e) {
            if(e instanceof FirebaseError) setError(ErrorMessage[ErrorCode.indexOf(e.code)])
        }
    }
    const onInValid = (errors: FieldErrors) => {
        console.log(errors)
    }
    return(
        <div className='pt-20 flex flex-col items-center space-y-10'>
            <h1 className='text-4xl font-bold'>회원가입</h1>
            <form className='w-full px-14 space-y-4' onSubmit={handleSubmit(onValid, onInValid)}>
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
                    placeholder='이메일을 입력하세요.'
                />
                <span className='text-red-600'>{errors.email?.message}</span>
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
                            }
                        )
                    }
                    type='text'
                    className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none'
                    placeholder='본명을 입력하세요.' 
                />
                <span className='text-red-600'>{errors.name?.message}</span>
                <input
                    {
                        ...register('password', {
                                required: '비밀번호를 입력해주세요.',
                                pattern: {
                                    value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/,
                                      message: '영문, 숫자, 특수문자 포함 8 ~ 20자로 입력해주세요'
                                },
                            }
                        )
                    }
                    type='password'
                    className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none'
                    placeholder='비밀번호를 입력하세요.'
                />
                <span className='text-red-600'>{errors.password?.message}</span>
                <input
                    {
                        ...register('passwordRE', {
                                required: '비밀번호를 다시 입력해주세요.',
                                validate: value => value === watch('password') ? true : '비밀번호가 일치하지 않습니다.'
                            }
                        )
                    }
                    type='password'
                    className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none'
                    placeholder='비밀번호를 다시 입력하세요.'
                />
                <span className='text-red-600'>{errors.passwordRE?.message}</span>
                <span className='text-red-600'>{error}</span>
                <button type='submit' className='w-full py-1.5 text-lg text-white text-center bg-instend hover:bg-hover transition-colors rounded-md'>가입하기</button>
                <div className='flex space-x-1 justify-center items-center'>
                    <Link href='/auth/signin' className='opacity-50 hover:opacity-70'>로그인</Link>
                </div>
            </form>
            <div className='flex justify-between w-full px-24'>
                {['google', 'apple', 'facebook'].map((name, i) => (
                    <div key={i} className='border border-black border-opacity-20 flex justify-center items-center w-14 h-14 rounded-full'>
                        <Image src={`/img/logo/${name}.svg`} alt={name} width={100} height={100} className={name == 'apple' ? 'w-7' : 'w-8'} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SignUp