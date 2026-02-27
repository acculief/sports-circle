import Link from 'next/link'
import { PREFECTURES, SKILL_LEVELS, VIBES } from '@/lib/constants'
import type { Post, Sport, User } from '@prisma/client'

type PostWithRelations = Post & {
  sport: Sport
  owner: Pick<User, 'name' | 'image' | 'handle'>
  _count: { favorites: number }
}

export default function PostCard({ post }: { post: PostWithRelations }) {
  const pref = PREFECTURES.find((p) => p.slug === post.prefecture)
  const skillLabel = SKILL_LEVELS.find((s) => s.value === post.skillLevel)?.label
  const vibeLabel = VIBES.find((v) => v.value === post.vibe)?.label

  return (
    <Link
      href={`/p/${post.slug}`}
      className="flex flex-col bg-white border border-gray-200 hover:border-blue-400 rounded-xl p-4 transition hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
            {post.sport.name}
          </span>
          {skillLabel && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
              {skillLabel}
            </span>
          )}
          {vibeLabel && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
              {vibeLabel}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
          ❤️ {post._count.favorites}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-2 text-sm sm:text-base leading-snug">{post.title}</h3>
      <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-3 flex-1">{post.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
        <span className="truncate mr-2">📍 {pref?.name}{post.city && `・${post.city}`}</span>
        <span className="whitespace-nowrap">{new Date(post.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
      </div>
      {(post.feeMin != null || post.feeMax != null) && (
        <div className="mt-2 text-xs sm:text-sm font-medium text-gray-700">
          💰 {post.feeMin != null ? `¥${post.feeMin.toLocaleString()}` : ''}
          {post.feeMax != null ? `〜¥${post.feeMax.toLocaleString()}` : '〜'}
        </div>
      )}
    </Link>
  )
}
