import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.NEXT_OPENAI_API_KEY })

export async function POST(req: Request) {
  const { content } = await req.json()

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `다음 글을 ~요 체로 1~2문장으로 간단히 요약해줘:\n${content}`,
      },
    ],
    model: 'gpt-3.5-turbo',
  })

  const summary = completion.choices[0]?.message.content
  return NextResponse.json({ summary })
}