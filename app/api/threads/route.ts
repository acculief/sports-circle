import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, ownerId } = await request.json()
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  // Don't allow owner to create thread on own post
  if (session.user.id === ownerId) {
    return NextResponse.json({ error: '自分の投稿には応募できません' }, { status: 400 })
  }

  const post = await prisma.post.findUnique({ where: { id: postId } })
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Upsert thread
  const thread = await prisma.thread.upsert({
    where: { postId_applicantId: { postId, applicantId: session.user.id } },
    update: {},
    create: {
      postId,
      ownerId: post.ownerId,
      applicantId: session.user.id,
    },
  })

  return NextResponse.json({ threadId: thread.id })
}
