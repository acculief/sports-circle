'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplyButton({ postId, ownerId }: { postId: string; ownerId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApply = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, ownerId }),
      })
      const data = await res.json()
      if (data.threadId) router.push(`/messages/${data.threadId}`)
    } catch {
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition"
    >
      {loading ? '処理中...' : '💬 応募/質問する'}
    </button>
  )
}
