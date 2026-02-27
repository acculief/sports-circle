import { prisma } from '@/lib/prisma'
import { PREFECTURES, SKILL_LEVELS, VIBES, GENDER_MIX, TIME_BANDS } from '@/lib/constants'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export const revalidate = 0

interface SearchParams {
  q?: string; prefecture?: string; sport?: string
  skillLevel?: string; vibe?: string; genderMix?: string
  timeBand?: string; sort?: string; page?: string
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
  if (params.genderMix) where.genderMix = params.genderMix
  if (params.timeBand) where.timeBand = params.timeBand
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
      { placeText: { contains: params.q, mode: 'insensitive' } },
    ]
  }

  let orderBy: Record<string, unknown> = { createdAt: 'desc' }
  if (params.sort === 'popular') orderBy = { viewCount: 'desc' }
  if (params.sort === 'favorites') orderBy = { favoriteCount: 'desc' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let posts: any[] = []
  let total = 0

  try {
    ;[posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy,
        skip,
        take: PAGE_SIZE,
        include: {
          sport: true,
          owner: { select: { name: true, image: true, handle: true } },
          _count: { select: { favorites: true } },
        },
      }),
      prisma.post.count({ where }),
    ])
  } catch (e) { console.error(e) }

  const sports = await prisma.sport.findMany({ orderBy: { name: 'asc' } }).catch(() => [])
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const currentPref = PREFECTURES.find((p) => p.slug === params.prefecture)

  return (
    <div className="flex gap-6">
      {/* Filters */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
          <h2 className="font-bold mb-4">絞り込み</h2>
          <form>
            {params.q && <input type="hidden" name="q" value={params.q} />}

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 block mb-2">都道府県</label>
              <select name="prefecture" defaultValue={params.prefecture}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                <option value="">全国</option>
                {PREFECTURES.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 block mb-2">スポーツ</label>
              <select name="sport" defaultValue={params.sport}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                <option value="">すべて</option>
                {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 block mb-2">レベル</label>
              <select name="skillLevel" defaultValue={params.skillLevel}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                <option value="">すべて</option>
                {SKILL_LEVELS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 block mb-2">雰囲気</label>
              <select name="vibe" defaultValue={params.vibe}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                <option value="">すべて</option>
                {VIBES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 block mb-2">時間帯</label>
              <select name="timeBand" defaultValue={params.timeBand}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                <option value="">すべて</option>
                {TIME_BANDS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition">
              絞り込む
            </button>
          </form>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">
              {currentPref ? currentPref.name : '全国'}の募集
              {params.q && <span className="text-gray-500 font-normal ml-2">「{params.q}」</span>}
            </h1>
            <p className="text-sm text-gray-500">{total}件</p>
          </div>
          <div className="flex gap-2">
            {[['new', '新着'], ['popular', '人気'], ['favorites', 'お気に入り']].map(([val, label]) => (
              <Link key={val} href={`?${new URLSearchParams({ ...params, sort: val as string })}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  (params.sort || 'new') === val
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p>条件に合う募集が見つかりませんでした</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={`?${new URLSearchParams({ ...params, page: String(p) })}`}
                className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm transition ${
                  p === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
