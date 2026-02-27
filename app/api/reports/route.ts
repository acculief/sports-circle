import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  const { targetType, targetId, reason, detail } = await request.json()
  if (!targetType || !targetId || !reason) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  await prisma.report.create({
    data: { targetType, targetId, reason, detail, reporterId: session?.user?.id ?? null },
  })
  return NextResponse.json({ success: true })
}
