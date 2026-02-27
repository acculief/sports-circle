import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId, ownerId } = await request.json()
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  // Don't allow owner to create thread on own post
  if (session.user.id === ownerId) {
    return NextResponse.json({ error: '自分の投稿には応募できません' }, { status: 400 })
  }

  const { data: post } = await db.from('Post').select('id, ownerId').eq('id', postId).single()
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Check for existing thread
  const { data: existing } = await db
    .from('Thread')
    .select('id')
    .eq('postId', postId)
    .eq('applicantId', session.user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ threadId: existing.id })
  }

  // Create new thread
  const { data: thread, error } = await db
    .from('Thread')
    .insert({
      postId,
      ownerId: post.ownerId,
      applicantId: session.user.id,
    })
    .select('id')
    .single()

  if (error || !thread) return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 })

  return NextResponse.json({ threadId: thread.id })
}
