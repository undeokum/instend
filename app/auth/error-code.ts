const ErrorCode: any = [
    'auth/invalid-credential',
    'auth/email-already-in-use',
    'auth/network-request-failed',
    'auth/internal-error'
]

const ErrorMessage = [
    '이메일 또는 비밀번호를 찾을 수 없습니다.',
    '이미 사용 중인 이메일입니다.',
    '네트워크 연결에 실패했습니다.',
    '잘못된 요청입니다.'
]

export { ErrorCode, ErrorMessage }