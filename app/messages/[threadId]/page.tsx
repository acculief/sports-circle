import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export const revalidate = 0

export default async function ThreadPage({ params }: { params: Promise<{ threadId: string }> }) {
  const { threadId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const { data: thread } = await db
    .from('Thread')
    .select(`
      *,
      post:Post(title, slug),
      owner:User!Thread_ownerId_fkey(id, name),
      applicant:User!Thread_applicantId_fkey(id, name),
      messages:Message(*, sender:User!Message_senderId_fkey(name, id))
    `)
    .eq('id', threadId)
    .single()

  if (!thread) notFound()
  if (thread.ownerId !== session.user.id && thread.applicantId !== session.user.id) {
    return <div className="text-center py-16 text-red-500">アクセス権限がありません</div>
  }

  const other = thread.ownerId === session.user.id ? thread.applicant : thread.owner
  const messages = (thread.messages || []).sort((a: any, b: any) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  async function sendMessage(formData: FormData) {
    'use server'
    const session = await auth()
    if (!session?.user?.id) return
    const body = formData.get('body') as string
    if (!body?.trim()) return

    await db.from('Message').insert({
      threadId,
      senderId: session.user!.id,
      body: body.trim(),
    })
    await db.from('Thread').update({
      lastMessageAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).eq('id', threadId)
    revalidatePath(`/messages/${threadId}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/messages" className="text-gray-400 hover:text-gray-600">←</Link>
        <div>
          <div className="font-bold">{other?.name || '名無し'}</div>
          <Link href={`/p/${thread.post?.slug}`} className="text-sm text-blue-600 hover:underline">
            {thread.post?.title}
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 space-y-4 min-h-64 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">最初のメッセージを送りましょう</div>
        ) : (
          messages.map((msg: any) => {
            const isMe = msg.senderId === session.user!.id
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                  isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.body}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <form action={sendMessage} className="flex gap-2">
        <input
          name="body"
          placeholder="メッセージを入力..."
          required
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition">
          送信
        </button>
      </form>
    </div>
  )
}
