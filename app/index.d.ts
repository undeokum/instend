export interface PostInstructure {
    image: string
    content: string
    createdAt: string
    userId: string
    anon: bool
    mm: number
    id: string
}

export interface HeartInstructure {
    userId: string
    heartId: string
}

export interface UserDataInstructure {
    neighbor: string
    school: string
}