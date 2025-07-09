import OpenAI from 'openai'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/app/firebase'
import { NextRequest, NextResponse } from 'next/server'

interface Post {
  content: string
  createdAt: string
  mm: number
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
})

function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magB = Math.sqrt(vecB.reduce((sum, b) => b * b, 0))
  return dot / (magA * magB)
}

async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
  })
  return response.data[0].embedding
}

async function fetchCommunityPosts(): Promise<Post[]> {
  const postSnapshot = await getDocs(collection(db, 'posts'))
  return postSnapshot.docs.map(doc => doc.data() as Post)
}

export async function GET(_req: NextRequest) {
  try {
    console.log('🔥 요약 API 시작')

    const posts = await fetchCommunityPosts()
    console.log('📦 불러온 글 개수:', posts.length)

    const defaultQuery = '인천 커뮤니티 트렌드 분석'
    const queryEmbedding = await getEmbedding(defaultQuery)
    console.log('🔢 쿼리 임베딩 완료')

    const postsWithEmbeddings = await Promise.all(
      posts.map(async post => {
        console.log('📝 처리 중 글:', post.content.slice(0, 20))
        return {
          ...post,
          embedding: await getEmbedding(post.content),
        }
      })
    )
    console.log('📊 모든 임베딩 완료')

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

각 카테고리마다 1~2문장으로 핵심을 정리해줘.`

    console.log('🧠 GPT에 전달할 프롬프트:', prompt)

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes community trends.' },
        { role: 'user', content: prompt },
      ],
    })

    const summary = completion.choices[0].message.content
    console.log('✅ 요약 완료:', summary)

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('❌ 요약 API 에러:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}