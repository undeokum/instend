import Image from 'next/image'
import Link from 'next/link'

const SignUp = () => {
    return (
        <div className='pt-20 flex flex-col items-center space-y-10'>
            <h1 className='text-4xl font-bold'>회원가입</h1>
            <form className='w-full px-14 space-y-4'>
                <input type='text' className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none' placeholder='아이디를 입력하세요.' />
                <input type='text' className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none' placeholder='이름을 입력하세요.' />
                <input type='password' className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none' placeholder='비밀번호를 입력하세요.' />
                <input type='password' className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none' placeholder='비밀번호를 다시 입력하세요.' />
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