export const runtime = 'nodejs'
import { NextRequest } from 'next/server'
import { apiBaseUrl } from '@/lib/api'

type Prompt = {
  id: number
  title: string
  role: string
  task: string
  context: string
  constraints: string[]
  output_format: string
  criteria: string
  status: 'active' | 'inactive'
  tags: string[]
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing API key on server' }), { status: 500, headers: corsHeaders() })
    }

    const body = await req.json()
    const promptId: number | undefined = body?.promptId
    const question: string | undefined = body?.question

    if (!question || !question.trim()) {
      return new Response(JSON.stringify({ error: 'question is required' }), { status: 400, headers: corsHeaders() })
    }

    let prompt: Prompt | null = null
    if (promptId) {
      const promptRes = await fetch(`${apiBaseUrl}/prompts/${promptId}`, { cache: 'no-store' })
      if (!promptRes.ok) {
        return new Response(JSON.stringify({ error: 'Failed to load prompt' }), { status: 502, headers: corsHeaders() })
      }
      prompt = await promptRes.json()
    } else {
      // No promptId provided: use the currently active prompt
      const listRes = await fetch(`${apiBaseUrl}/prompts?status=active&limit=1`, { cache: 'no-store' })
      if (!listRes.ok) {
        return new Response(JSON.stringify({ error: 'Failed to load active prompt' }), { status: 502, headers: corsHeaders() })
      }
      const rows: Prompt[] = await listRes.json()
      prompt = rows[0] || null
      if (!prompt) {
        return new Response(JSON.stringify({ error: 'No active prompt set' }), { status: 400, headers: corsHeaders() })
      }
    }

    // Build the system prompt from fields
    const systemContent = [
      `Role: ${prompt.role}`,
      `Task: ${prompt.task}`,
      `Context: ${prompt.context}`,
      prompt.constraints && prompt.constraints.length ? `Constraints: ${prompt.constraints.join('; ')}` : '',
      `Output format: ${prompt.output_format}`,
      `Criteria: ${prompt.criteria}`,
    ].filter(Boolean).join('\n')

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
      })
    })

    if (!openaiRes.ok) {
      const errText = await openaiRes.text()
      return new Response(JSON.stringify({ error: 'OpenAI request failed', details: errText }), { status: 502, headers: corsHeaders() })
    }

    const data = await openaiRes.json()
    const answer: string = data?.choices?.[0]?.message?.content || ''
    const payload = {
      answer,
      usedPromptId: prompt.id,
      usedPromptTitle: prompt.title,
    }
    return new Response(JSON.stringify(payload), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } })
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500, headers: corsHeaders() })
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}


