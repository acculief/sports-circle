import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const revalidate = 0

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const threads = await prisma.thread.findMany({
    where: {
      OR: [{ ownerId: session.user.id }, { applicantId: session.user.id }],
    },
    include: {
      post: { select: { title: true, slug: true, sport: true } },
      owner: { select: { name: true, image: true } },
      applicant: { select: { name: true, image: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { lastMessageAt: 'desc' },
  })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black mb-6">メッセージ</h1>
      {threads.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3"></p>
          <p>メッセージはまだありません</p>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => {
            const other = thread.ownerId === session.user!.id ? thread.applicant : thread.owner
            const lastMsg = thread.messages[0]
            return (
              <Link key={thread.id} href={`/messages/${thread.id}`}
                className="block bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-4 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                    {(other.name || 'U')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{other.name || '名無し'}</div>
                    <div className="text-xs text-blue-600 truncate">{thread.post.title}</div>
                    {lastMsg && <p className="text-sm text-gray-500 truncate mt-0.5">{lastMsg.body}</p>}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(thread.lastMessageAt).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
