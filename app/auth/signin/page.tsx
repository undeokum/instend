'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FieldErrors, useForm } from 'react-hook-form'

interface SignInFormType {
    email: string
    password: string
}

const SignIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormType>()
    const onValid = async (data: SignInFormType) => {
        // firebase
    }
    const onInValid = (errors: FieldErrors) => {
        console.log(errors)
    }
    return (
        <div className='pt-20 flex flex-col items-center space-y-10'>
            <h1 className='text-4xl font-bold'>로그인</h1>
            <form className='w-full px-14 space-y-4' onSubmit={handleSubmit(onValid, onInValid)}>
                <input
                    {
                        ...register('email',
                            {
                                required: '이메일을 입력해주세요.',
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
                        ...register('password', 
                            {
                                required: '비밀번호를 입력해주세요.',
                            }
                        )
                    }
                    type='password'
                    className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none'
                    placeholder='비밀번호를 입력하세요.'
                />
                <span className='text-red-600'>{errors.password?.message}</span>
                <button type='submit' className='w-full py-1.5 text-lg text-white text-center bg-instend hover:bg-hover transition-colors rounded-md'>로그인</button>
                <div className='flex space-x-1 justify-center items-center'>
                    <Link href='/auth/signup' className='opacity-50 hover:opacity-70'>회원가입</Link>
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

export default SignIn