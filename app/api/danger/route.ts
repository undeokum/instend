import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.NEXT_OPENAI_API_KEY })

export async function POST(req: Request) {
  const { content } = await req.json()

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `너는 온라인 커뮤니티에 올라온 게시글을 분석해서 민감한 글인지 아닌지를 판단하는 AI야.

아래 조건 중 하나라도 해당되면 "민감한 글"로 분류해야 해:
1. 욕설이나 비속어가 포함된 글
2. 특정 인물이나 집단에 대한 비방, 혐오 표현이 포함된 글
3. 성희롱, 외설적인 표현, 선정적인 언급이 포함된 글
4. 정치, 종교, 성별 등에 대한 민감한 갈등을 유발할 수 있는 내용
5. 자해, 자살, 폭력, 학대 등과 관련된 위험한 내용

게시글을 보고 아래 중 하나로만 대답해:
- 민감한 글
- 민감하지 않음

절대로 그 외의 말은 하지 마. 오직 위 두 가지 중 하나만 대답해.
문장부호도 절대 넣지마.

게시글:
${content}`,
      },
    ],
    model: 'gpt-3.5-turbo',
  })

  const value = completion.choices[0]?.message.content?.trim()
  console.log(value)
  const danger = value == '민감한 글' ? 1 : (value == '민감하지 않음' ? 0 : 2)
  return NextResponse.json({ danger })
}