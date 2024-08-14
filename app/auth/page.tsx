import Image from 'next/image'
import Link from 'next/link'

const Auth = () => {
    return (
        <div className='flex flex-col items-center pt-20 space-y-14'>
            <div className='flex flex-col items-center space-y-3'>
                <Image src='/img/logo.svg' width={100} height={100} alt='logo' className='w-24' />
                <h1 className='text-5xl font-bold'>인스텐드</h1>
                <p className='opacity-50 text-xl'>대신 전해드립니다.</p>
            </div>
            <div className='w-full flex flex-col px-20 space-y-3'>
                <Link href='/auth/signin' className='border border-black border-opacity-20 py-1.5 text-lg rounded-md flex items-center justify-center bg-white hover:bg-black hover:bg-opacity-10 transition-colors'>로그인</Link>
                <Link href='/auth/signup' className='bg-instend hover:bg-hover transition-colors text-white py-1.5 text-lg rounded-md flex items-center justify-center'>회원가입</Link>
            </div>
        </div>
    )
}

export default Auth