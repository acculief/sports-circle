import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { postId } = await request.json()
  try {
    await db.from('Favorite').insert({ userId: session.user.id, postId })
    // Increment favoriteCount
    const { data: post } = await db.from('Post').select('favoriteCount').eq('id', postId).single()
    if (post) {
      await db.from('Post').update({ favoriteCount: (post.favoriteCount || 0) + 1 }).eq('id', postId)
    }
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Already favorited' }, { status: 409 }) }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { postId } = await request.json()
  await db.from('Favorite').delete().eq('userId', session.user.id).eq('postId', postId)
  // Decrement favoriteCount
  const { data: post } = await db.from('Post').select('favoriteCount').eq('id', postId).single()
  if (post) {
    await db.from('Post').update({ favoriteCount: Math.max(0, (post.favoriteCount || 0) - 1) }).eq('id', postId)
  }
  return NextResponse.json({ success: true })
}
