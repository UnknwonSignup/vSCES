import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1'

const SYSTEM_PROMPT = `You are Reverie, the friendly AI assistant for Reverie SMP — a Minecraft survival multiplayer server.
You help players with:
- Server rules and guidelines
- How to apply for ranks or staff
- Information about the store and vote rewards
- How to submit support tickets
- General Minecraft tips and tricks
- Server events and announcements
Keep responses concise, friendly, and helpful. Use Minecraft-themed language when appropriate.
If you don't know something specific about the server, suggest players check the website sections or submit a ticket.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI chatbot not configured' }, { status: 503 })
  }

  let body: { messages?: { role: string; content: string }[]; model?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const userMessages = (body.messages ?? []).slice(-10) // keep last 10 messages for context
  const model = process.env.NVIDIA_MODEL ?? 'nvidia/llama-3.1-nemotron-70b-instruct'

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...userMessages,
  ]

  try {
    const upstream = await fetch(`${NVIDIA_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 512,
        temperature: 0.7,
        stream: true,
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!upstream.ok) {
      const err = await upstream.text()
      console.error('[chat] NVIDIA error:', upstream.status, err)
      return NextResponse.json({ error: 'AI service error' }, { status: 502 })
    }

    // Stream SSE back to client
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()
    const encoder = new TextEncoder()

    ;(async () => {
      try {
        const reader = upstream.body!.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buf += decoder.decode(value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() ?? ''
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                await writer.write(encoder.encode('data: [DONE]\n\n'))
              } else {
                try {
                  const parsed = JSON.parse(data)
                  const delta = parsed.choices?.[0]?.delta?.content ?? ''
                  if (delta) {
                    await writer.write(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`))
                  }
                } catch {
                  // skip malformed chunks
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('[chat] stream error:', err)
      } finally {
        await writer.close()
      }
    })()

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('[chat] fetch error:', err)
    return NextResponse.json({ error: 'Connection failed' }, { status: 503 })
  }
}
