import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  const session = await auth()
  const { targetType, targetId, reason, detail } = await request.json()
  if (!targetType || !targetId || !reason) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  await db.from('Report').insert({
    targetType,
    targetId,
    reason,
    detail,
    reporterId: session?.user?.id ?? null,
  })
  return NextResponse.json({ success: true })
}
