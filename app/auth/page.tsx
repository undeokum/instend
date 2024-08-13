import Image from 'next/image'

const Auth = () => {
    return (
        <div className='flex flex-col items-center pt-12 space-y-14'>
            <div className='flex flex-col items-center space-y-3'>
                <Image src='/img/logo.svg' width={100} height={100} alt='logo' className='w-24' />
                <h1 className='text-5xl font-bold'>인스텐드</h1>
                <p className='opacity-50 text-xl'>대신 전해드립니다.</p>
            </div>
            <div className='w-full flex flex-col px-20 space-y-3'>
                <button className='border border-black border-opacity-20 py-1 text-lg rounded-md'>로그인</button>
                <button className='bg-instend text-white py-1 text-lg rounded-md'>회원가입</button>
            </div>
        </div>
    )
}

export default Auth