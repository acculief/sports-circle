import { prisma } from '@/lib/prisma'
import { PREFECTURES, SKILL_LEVELS, VIBES } from '@/lib/constants'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export const revalidate = 0

interface SearchParams {
  q?: string; prefecture?: string; sport?: string
  skillLevel?: string; vibe?: string; timeBand?: string
  sort?: string; page?: string
}

const PAGE_SIZE = 12

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const skip = (page - 1) * PAGE_SIZE

  const where: Record<string, unknown> = { status: 'active' }
  if (params.prefecture) where.prefecture = params.prefecture
  if (params.sport) where.sportId = params.sport
  if (params.skillLevel) where.skillLevel = params.skillLevel
  if (params.vibe) where.vibe = params.vibe
  if (params.timeBand) where.timeBand = params.timeBand
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
    ]
  }

  let orderBy: Record<string, unknown> = { createdAt: 'desc' }
  if (params.sort === 'popular') orderBy = { viewCount: 'desc' }
  if (params.sort === 'favorites') orderBy = { favoriteCount: 'desc' }

  let posts: any[] = []
  let total = 0
  const sports = await prisma.sport.findMany({ orderBy: { name: 'asc' } }).catch(() => [])

  try {
    ;[posts, total] = await Promise.all([
      prisma.post.findMany({
        where, orderBy, skip, take: PAGE_SIZE,
        include: {
          sport: true,
          owner: { select: { name: true, image: true, handle: true } },
          _count: { select: { favorites: true } },
        },
      }),
      prisma.post.count({ where }),
    ])
  } catch {}

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      {/* Search bar */}
      <form className="mb-4">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="スポーツ・キーワードで検索..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium text-sm transition whitespace-nowrap">
            検索
          </button>
        </div>

        {/* Filter row - SP: horizontal scroll */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          <select name="prefecture" defaultValue={params.prefecture}
            className="flex-shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none">
            <option value="">都道府県</option>
            {PREFECTURES.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
          <select name="sport" defaultValue={params.sport}
            className="flex-shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none">
            <option value="">スポーツ</option>
            {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select name="skillLevel" defaultValue={params.skillLevel}
            className="flex-shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none">
            <option value="">レベル</option>
            {SKILL_LEVELS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select name="vibe" defaultValue={params.vibe}
            className="flex-shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none">
            <option value="">雰囲気</option>
            {VIBES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
        </div>
      </form>

      {/* Sort + count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500">{total}件</p>
        <div className="flex gap-1">
          {[['new', '新着'], ['popular', '人気']].map(([val, label]) => (
            <Link key={val} href={`?${new URLSearchParams({ ...params, sort: val as string })}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                (params.sort || 'new') === val
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">条件に合う募集が見つかりませんでした</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm transition ${
                p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'
              }`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
