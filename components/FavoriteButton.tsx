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
      className={`w-full py-2 rounded-xl text-sm font-medium transition border ${
        favorited
          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
      }`}
    >
      {favorited ? '❤️ お気に入り済み' : '🤍 お気に入りに追加'}
    </button>
  )
}
