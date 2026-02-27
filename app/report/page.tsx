'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const REASONS = [
  { value: 'spam', label: 'スパム・宣伝' },
  { value: 'scam', label: '詐欺・不正' },
  { value: 'harassment', label: '嫌がらせ' },
  { value: 'illegal', label: '違法・規約違反' },
  { value: 'other', label: 'その他' },
]

function ReportForm() {
  const searchParams = useSearchParams()
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const targetType = searchParams.get('targetType') || 'post'
  const targetId = searchParams.get('targetId') || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, reason, detail }),
      })
      setSubmitted(true)
    } finally { setLoading(false) }
  }

  if (submitted) return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-xl font-bold mb-2">通報を受け付けました</h2>
      <p className="text-gray-500">確認後、適切な対応を行います。</p>
    </div>
  )

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-black mb-6">通報する</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">通報理由</label>
          {REASONS.map((r) => (
            <label key={r.value} className="flex items-center gap-2 py-1.5 cursor-pointer">
              <input type="radio" name="reason" value={r.value} onChange={(e) => setReason(e.target.value)} required />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">詳細（任意）</label>
          <textarea value={detail} onChange={(e) => setDetail(e.target.value)}
            rows={4} maxLength={1000}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
        <button type="submit" disabled={!reason || loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition">
          {loading ? '送信中...' : '通報する'}
        </button>
      </form>
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">読み込み中...</div>}>
      <ReportForm />
    </Suspense>
  )
}
