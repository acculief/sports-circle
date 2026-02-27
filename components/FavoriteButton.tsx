'use client'
import { useState } from 'react'

export default function FavoriteButton({ postId, initialFavorited }: { postId: string; initialFavorited: boolean }) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/favorites', {
        method: favorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      })
      if (res.ok) setFavorited(!favorited)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full py-2 rounded-xl text-sm font-medium transition border flex items-center justify-center gap-1.5 ${
        favorited
          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
      }`}
    >
      <svg className="w-4 h-4" fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {favorited ? 'お気に入り済み' : 'お気に入りに追加'}
    </button>
  )
}
