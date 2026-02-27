import Link from 'next/link'
import { PREFECTURES } from '@/lib/constants'
import type { Post, Sport, User } from '@prisma/client'

type PostWithRelations = Post & {
  sport: Sport
  owner: Pick<User, 'name' | 'image' | 'handle'>
  _count: { favorites: number }
}

const SKILL_LABELS: Record<string, string> = { beginner: '初心者可', intermediate: '中級', advanced: '上級', any: '誰でも' }
const VIBE_LABELS: Record<string, string> = { casual: 'ゆるい', standard: '普通', serious: '本気' }

export default function PostCard({ post }: { post: PostWithRelations }) {
  const pref = PREFECTURES.find((p) => p.slug === post.prefecture)

  return (
    <Link
      href={`/p/${post.slug}`}
      className="flex flex-col bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-xl p-4 transition"
    >
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
          {post.sport?.name}
        </span>
        {SKILL_LABELS[post.skillLevel] && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {SKILL_LABELS[post.skillLevel]}
          </span>
        )}
        {VIBE_LABELS[post.vibe] && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {VIBE_LABELS[post.vibe]}
          </span>
        )}
      </div>
      <h3 className="font-bold text-sm leading-snug mb-1.5 line-clamp-2">{post.title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 flex-1">{post.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-2.5 border-t border-gray-100">
        <span className="truncate">{pref?.name || post.prefecture}{post.city && String.fromCharCode(12539) + post.city}</span>
        <span>{new Date(post.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
      </div>
    </Link>
  )
}
