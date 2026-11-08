'use server'

import { revalidatePath } from 'next/cache'
import {
  canSubmitTicket,
  createTicket,
  createTicketMessage,
  deleteTicket,
  readTickets,
  updateTicketStatus,
  type TicketStatus,
} from '@/lib/store'
import { getSession, requireAdmin } from '@/lib/admin-auth'
import { getDiscordSession } from '@/lib/discord-auth'

export type TicketState = { ok: boolean; message: string } | null
export type TicketMessageState = { ok: boolean; message: string } | null

export async function submitTicketAction(_prev: TicketState, fd: FormData): Promise<TicketState> {
  if (fd.get('website')) return { ok: true, message: 'Ticket submitted.' }

  const title = String(fd.get('title') ?? '').trim()
  const reason = String(fd.get('reason') ?? '').trim()
  const minecraftUser = String(fd.get('minecraftUser') ?? '').trim()
  const discordUser = String(fd.get('discordUser') ?? '').trim()
  const content = String(fd.get('content') ?? '').trim()

  if (title.length < 3 || title.length > 120) return { ok: false, message: 'Title must be 3-120 characters.' }
  if (!reason) return { ok: false, message: 'Please select a reason.' }
  if (!/^[A-Za-z0-9_]{2,16}$/.test(minecraftUser)) return { ok: false, message: 'Enter a valid Minecraft username (2-16 characters).' }
  if (!/^.{2,32}#[0-9]{4}$|^[a-z0-9_.]{2,32}$/i.test(discordUser)) return { ok: false, message: 'Enter a valid Discord username.' }
  if (content.length < 10 || content.length > 3000) return { ok: false, message: 'Description must be 10-3000 characters.' }

  if (!(await canSubmitTicket(discordUser))) return { ok: false, message: 'Please wait 5 minutes before submitting another ticket.' }

  const discordSession = await getDiscordSession()

  await createTicket({
    title,
    reason,
    minecraftUser,
    discordUser,
    content,
    discordUserId: discordSession?.id,
  })

  revalidatePath('/tickets')
  return { ok: true, message: 'Ticket submitted! Staff will review it shortly.' }
}

export async function postTicketMessageAction(_prev: TicketMessageState, fd: FormData): Promise<TicketMessageState> {
  const ticketId = String(fd.get('ticketId') ?? '').trim()
  const content = String(fd.get('content') ?? '').trim()

  if (!ticketId) return { ok: false, message: 'Ticket ID is required.' }
  if (content.length < 1 || content.length > 2000) {
    return { ok: false, message: 'Message must be between 1 and 2,000 characters.' }
  }

  const tickets = await readTickets()
  const ticket = tickets.find((t) => t.id === ticketId)
  if (!ticket) return { ok: false, message: 'Ticket not found.' }

  const adminSession = await getSession()
  const discordSession = await getDiscordSession()

  let isStaff = false
  let authorName = ''
  let authorId = ''

  if (adminSession) {
    isStaff = true
    authorName = adminSession.username || 'Staff'
    authorId = 'staff'
  } else if (discordSession) {
    const isOwner =
      (ticket.discordUserId && ticket.discordUserId === discordSession.id) ||
      ticket.discordUser.toLowerCase() === discordSession.username.toLowerCase()
    if (!isOwner) {
      return { ok: false, message: 'You are not authorized to post on this ticket.' }
    }
    isStaff = false
    authorName = discordSession.username
    authorId = discordSession.id
  } else {
    return { ok: false, message: 'Please connect your Discord account or sign in as staff to reply.' }
  }

  await createTicketMessage({
    ticketId,
    authorId,
    authorName,
    content,
    isStaff,
  })

  revalidatePath(`/tickets/${ticketId}`)
  return { ok: true, message: 'Message sent!' }
}

export async function updateTicketStatusAction(fd: FormData): Promise<TicketState> {
  await requireAdmin()
  const id = String(fd.get('id') ?? '').trim()
  const status = String(fd.get('status') ?? '').trim() as TicketStatus
  if (!id || !['open', 'in-progress', 'closed'].includes(status)) return { ok: false, message: 'Invalid.' }
  await updateTicketStatus(id, status)
  revalidatePath('/adminpanel')
  revalidatePath(`/tickets/${id}`)
  return { ok: true, message: 'Status updated.' }
}

export async function deleteTicketAction(fd: FormData): Promise<void> {
  await requireAdmin()
  const id = String(fd.get('id') ?? '').trim()
  if (id) await deleteTicket(id)
  revalidatePath('/adminpanel')
}
