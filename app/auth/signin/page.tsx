const SignIn = () => {
    return (
        <div className='pt-12 flex flex-col items-center space-y-10'>
            <h1 className='text-4xl font-bold'>로그인</h1>
            <form className='w-full px-14 space-y-4'>
                <input type='text' className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none' placeholder='이메일 또는 아이디를 입력하세요.' />
                <input type='password' className='w-full border border-black border-opacity-20 px-5 py-1.5 rounded-md focus:ring-2 focus:ring-instend focus:outline-none' placeholder='비밀번호를 입력하세요.' />
                <button type='submit' className='w-full py-1.5 text-lg text-white text-center bg-instend rounded-md'>로그인</button>
                <div className='flex space-x-1 opacity-50 justify-center items-center'>
                    <span>회원가입</span>
                    <div>&#183;</div>
                    <span>비밀번호 찾기</span>
                </div>
            </form>
            <div></div>
        </div>
    )
}

export default SignIn