'use client'

import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'
import { useEffect, useRef, useState } from 'react'
import { faComment, faHeart as rHeart } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { Timestamp } from 'firebase-admin/firestore'

interface PostInstructure {
  content: string
  createdAt: string
  mm: number
}

interface SummaryType {
    content: string
    createdAt: Timestamp
}

const RagTest = () => {
  const [posts, setPosts] = useState<PostInstructure[]>([])
  const [opened, setOpened] = useState(false)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    const postsQuery = query(collection(db, 'posts'), orderBy('mm', 'desc'))
    const snapshop = await getDocs(postsQuery)
    const posts = snapshop.docs.map(doc => {
      const { content, createdAt, mm } = doc.data()
      return { content, createdAt, mm }
    })
    setPosts(posts)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

const didFetch = useRef(false)

useEffect(() => {
  setLoading(true)
  if (didFetch.current) return
  didFetch.current = true

  const fetchSummary = async () => {
    const res = await fetch('/api/summary')
    const data = await res.json()
    // if(user) 넣기
    // if(Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
    setSummary(data.summary)
    setLoading(false)
  }
  fetchSummary()
}, [])

  return (
    <div className='space-y-8'>
      <div
        className='px-8 rounded-md bg-[#DAD2E9] py-5 cursor-pointer flex items-center justify-between'
        onClick={() => setOpened(!opened)}
      >
        {opened ? (
          <div className='pr-5 space-y-4'>
            <div>AI가 지난 일주일 동안의 인천광역시의 트렌드를 정리해봤어요.</div>
            {
              loading
              ?
              <div className='felx items-center justify-center text-center py-5'>
                <p>요약중...</p>
              </div>
              :
              <pre className='whitespace-pre-wrap font-regular'>{summary}</pre>
            }
          </div>
        ) : (
          <span>AI가 인천광역시의 최신 트렌드를 정리해봤어요 🔥</span>
        )}
        <div>
          <FontAwesomeIcon icon={opened ? faChevronUp : faChevronDown} />
        </div>
      </div>

      <div className='space-y-8'>
        {posts.map(postInfo => (
          <div
            key={postInfo.mm}
            className='border border-black border-opacity-20 px-8 rounded-md py-5 flex justify-between cursor-pointer hover:bg-black hover:bg-opacity-5 transition-opacity'
          >
            <div className='space-y-3'>
              <h1 className='font-medium text-xl'>
                {postInfo.content.length > 20
                  ? `${postInfo.content.slice(0, 20)}...`
                  : postInfo.content}
              </h1>
              <div className='flex space-x-1'>
                <span className='text-instend'>익명</span>
                <div className='text-black text-opacity-50'>&#183;</div>
                <span className='text-black text-opacity-50'>{postInfo.createdAt}</span>
              </div>
              <div className='flex space-x-8'>
                <div className='space-x-3 flex items-center'>
                  <FontAwesomeIcon icon={rHeart} className='w-5 h-5 text-instend_red' />
                  <span>5</span>
                </div>
                <div className='space-x-3 flex items-center'>
                  <FontAwesomeIcon icon={faComment} className='w-5 h-5' />
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RagTest
