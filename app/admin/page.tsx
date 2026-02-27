import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const revalidate = 0

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'admin') redirect('/')

  const reports = await prisma.report.findMany({
    where: { status: 'open' },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  async function resolveReport(formData: FormData) {
    'use server'
    const reportId = formData.get('reportId') as string
    const action = formData.get('action') as string
    const postId = formData.get('postId') as string

    if (action === 'pause' && postId) {
      await prisma.post.update({ where: { id: postId }, data: { status: 'paused' } })
    }
    await prisma.report.update({ where: { id: reportId }, data: { status: 'reviewed' } })
    revalidatePath('/admin')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-black mb-6">管理パネル</h1>
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="font-bold text-lg mb-4">未処理通報 ({reports.length}件)</h2>
        {reports.length === 0 ? <p className="text-gray-400">未処理の通報はありません</p> : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium">{report.targetType}: {report.targetId}</div>
                    <div className="text-sm text-red-600">{report.reason}</div>
                    {report.detail && <p className="text-xs text-gray-500 mt-1">{report.detail}</p>}
                    <div className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString('ja-JP')}</div>
                  </div>
                  <form action={resolveReport} className="flex gap-2 flex-shrink-0">
                    <input type="hidden" name="reportId" value={report.id} />
                    <input type="hidden" name="postId" value={report.targetType === 'post' ? report.targetId : ''} />
                    <button name="action" value="dismiss" className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition">
                      無視
                    </button>
                    {report.targetType === 'post' && (
                      <button name="action" value="pause" className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition">
                        投稿停止
                      </button>
                    )}
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
