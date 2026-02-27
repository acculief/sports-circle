import { getPosts, countPosts, getSports } from '@/lib/queries'
import { PREFECTURES, SKILL_LEVELS, VIBES } from '@/lib/constants'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export const revalidate = 0

interface SearchParams {
  q?: string; prefecture?: string; sport?: string
  skillLevel?: string; vibe?: string; timeBand?: string
  sort?: string; page?: string
}

const PAGE_SIZE = 15

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const skip = (page - 1) * PAGE_SIZE

  const orderBy = params.sort === 'popular' ? 'viewCount' as const
    : params.sort === 'favorites' ? 'favoriteCount' as const
    : 'createdAt' as const

  let posts: any[] = []
  let total = 0
  const sports = await getSports()

  try {
    ;[posts, total] = await Promise.all([
      getPosts({
        status: 'active',
        prefecture: params.prefecture || undefined,
        sportId: params.sport || undefined,
        skillLevel: params.skillLevel || undefined,
        vibe: params.vibe || undefined,
        timeBand: params.timeBand || undefined,
        q: params.q || undefined,
        limit: PAGE_SIZE,
        offset: skip,
        orderBy,
      }),
      countPosts({
        status: 'active',
        prefecture: params.prefecture || undefined,
        sportId: params.sport || undefined,
        skillLevel: params.skillLevel || undefined,
        vibe: params.vibe || undefined,
        timeBand: params.timeBand || undefined,
        q: params.q || undefined,
      }),
    ])
  } catch {}

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">
        {params.q ? `"${params.q}" の検索結果` : 'スポーツサークル募集一覧'}
      </h1>

      <form className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="flex gap-2 mb-3">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="スポーツ・キーワード..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shrink-0">
            検索
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          <select name="prefecture" defaultValue={params.prefecture}
            className="shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">都道府県</option>
            {PREFECTURES.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
          <select name="sport" defaultValue={params.sport}
            className="shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">スポーツ</option>
            {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select name="skillLevel" defaultValue={params.skillLevel}
            className="shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">レベル</option>
            {SKILL_LEVELS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select name="vibe" defaultValue={params.vibe}
            className="shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">雰囲気</option>
            {VIBES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
          <select name="sort" defaultValue={params.sort}
            className="shrink-0 border border-gray-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">新着順</option>
            <option value="popular">人気順</option>
            <option value="favorites">いいね順</option>
          </select>
        </div>
      </form>

      <p className="text-xs text-gray-500 mb-3">{total}件</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl text-gray-400 text-sm">
          条件に合う募集が見つかりませんでした
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm transition ${
                p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}>
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
