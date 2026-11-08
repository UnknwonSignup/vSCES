'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X, Send, Loader2, Bot } from 'lucide-react'
import { useChatbot } from './chatbot-context'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  pending?: boolean
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-current opacity-60"
          style={{ animation: `chatbotBounce 1s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
    </span>
  )
}

export function Chatbot() {
  const { open, setOpen } = useChatbot()

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey there! 👋 I'm Reverie, your Minecraft server assistant. Ask me anything about the server, rules, ranks, or how to get started!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open, scrollToBottom])

  useEffect(() => {
    if (open) scrollToBottom()
  }, [messages, open, scrollToBottom])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const assistantId = crypto.randomUUID()
    const pendingMsg: Message = { id: assistantId, role: 'assistant', content: '', pending: true }

    setMessages((prev) => [...prev, userMsg, pendingMsg])
    setLoading(true)

    const history = [...messages, userMsg].slice(-10).map(({ role, content }) => ({ role, content }))

    const abort = new AbortController()
    abortRef.current = abort

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: abort.signal,
      })

      if (!res.ok) throw new Error(await res.text())

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buf = ''
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() ?? ''
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              accumulated += parsed.content ?? ''
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: accumulated, pending: false } : m
                )
              )
            } catch { /* skip */ }
          }
        }
      }

      if (!accumulated) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "Sorry, I couldn't get a response. Please try again!", pending: false }
              : m
          )
        )
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: '⚠️ Something went wrong. Please try again in a moment.', pending: false }
            : m
        )
      )
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [input, loading, messages])

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  if (!open) return null

  return (
    <>
      <style>{`
        @keyframes chatbotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes chatbotSlideIn {
          from { opacity: 0; transform: translateX(20px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)    scale(1);    }
        }
        .chatbot-panel { animation: chatbotSlideIn 0.22s ease; }
      `}</style>

      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Panel — bottom-center on mobile, right sidebar on desktop */}
      <div
        role="dialog"
        aria-label="Reverie AI Chat"
        className="chatbot-panel fixed bottom-20 left-2 right-2 z-50 flex max-h-[75dvh] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/25 md:bottom-6 md:left-auto md:right-24 md:w-96 md:max-h-[560px]"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-4 py-3">
          <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/30">
            <Bot className="size-4 text-primary" aria-hidden="true" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Reverie AI</p>
            <p className="text-xs text-muted-foreground">Powered by NVIDIA NIM</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <Bot className="size-3.5 text-primary" aria-hidden="true" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-primary text-primary-foreground'
                    : 'rounded-tl-sm bg-secondary text-foreground'
                }`}
              >
                {msg.pending ? <TypingDots /> : msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-border bg-card p-3">
          <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2 transition-all focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/30">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything…"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
              style={{ maxHeight: 80 }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send message"
              className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all duration-150 hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
            AI responses may not reflect actual server info
          </p>
        </div>
      </div>
    </>
  )
}
