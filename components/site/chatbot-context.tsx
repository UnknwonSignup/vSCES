'use client'

import { createContext, useCallback, useContext, useState } from 'react'

type ChatbotCtx = {
  open: boolean
  toggle: () => void
  setOpen: (v: boolean) => void
}

const ChatbotContext = createContext<ChatbotCtx>({
  open: false,
  toggle: () => {},
  setOpen: () => {},
})

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen((v) => !v), [])
  return (
    <ChatbotContext.Provider value={{ open, toggle, setOpen }}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  return useContext(ChatbotContext)
}
