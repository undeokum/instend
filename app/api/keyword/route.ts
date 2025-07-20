import OpenAI from 'openai'
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { db } from '@/app/firebase'
import { NextRequest, NextResponse } from 'next/server'

interface Post {
  content: string
  createdAt: string
  mm: Timestamp
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
})

function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))
  return dot / (magA * magB)
}

async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
  })
  return response.data[0].embedding
}

async function fetchCommunityPosts(path: string): Promise<Post[]> {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  console.log(sevenDaysAgo)
  const postsQuery = query(
    collection(db, path),
    where('mm', '>=', sevenDaysAgo)
  )
  const postSnapshot = await getDocs(postsQuery)
  return postSnapshot.docs.map(doc => doc.data() as Post)
}

export async function GET(_req: NextRequest) {
  const { searchParams } = new URL(_req.url)
  const path = searchParams.get('path')

  try {
    const posts = await fetchCommunityPosts(path!)

    if (posts.length === 0) {
      return NextResponse.json({ summary: '최근 7일간 작성된 게시물이 없습니다.' })
    }

    const defaultQuery = '인천 커뮤니티 트렌드 분석'
    const queryEmbedding = await getEmbedding(defaultQuery)

    const postsWithEmbeddings = await Promise.all(
      posts.map(async post => {
        return {
          ...post,
          embedding: await getEmbedding(post.content),
        }
      })
    )

    const topPosts = postsWithEmbeddings
      .map(post => ({
        ...post,
        score: cosineSimilarity(queryEmbedding, post.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    const context = topPosts.map(p => `- ${p.content}`).join('\n')
    const prompt = `너는 지역 커뮤니티의 글들을 분석해서 트렌드를 요약하는 AI야.
아래는 지난 일주일 동안 인천 커뮤니티에 올라온 글 목록이야:

${context}

위 내용을 바탕으로 아래 4가지 카테고리로 나눠서 요약해줘:
1. 🎯 일상 / 잡담
2. 🧩 정보 / 팁
3. 🚧 불편 / 건의
4. 🏠 생활 / 환경

각 카테고리마다 1~2문장으로 핵심을 정리해주고, 정리 후 한 줄 띄어줘. 추가적인 요약이나 결론 문장은 작성하지 마.
또 요약문장 안에 괄호 같은 문장부호는 쓰지 말아줘. 문장부호는 쉼표와 마침표만 허용돼.
그리고 ~입니다 체로 문장을 작성해줘.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes community trends.' },
        { role: 'user', content: prompt },
      ],
    })

    const summary = completion.choices[0].message.content

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('API 에러:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
