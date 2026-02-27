import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { postId } = await request.json()
  try {
    await prisma.favorite.create({ data: { userId: session.user.id, postId } })
    await prisma.post.update({ where: { id: postId }, data: { favoriteCount: { increment: 1 } } })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: 'Already favorited' }, { status: 409 }) }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { postId } = await request.json()
  await prisma.favorite.delete({ where: { userId_postId: { userId: session.user.id, postId } } })
  await prisma.post.update({ where: { id: postId }, data: { favoriteCount: { decrement: 1 } } })
  return NextResponse.json({ success: true })
}
