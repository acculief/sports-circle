import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PREFECTURES, SPORTS_CATEGORIES } from '@/lib/constants'
import PostCard from '@/components/PostCard'

export const revalidate = 1800

async function getRecentPosts() {
  try {
    return await prisma.post.findMany({
      where: { status: 'active' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        sport: true,
        owner: { select: { name: true, image: true, handle: true } },
        _count: { select: { favorites: true } },
      },
    })
  } catch { return [] }
}

async function getPopularPosts() {
  try {
    return await prisma.post.findMany({
      where: { status: 'active' },
      take: 6,
      orderBy: { viewCount: 'desc' },
      include: {
        sport: true,
        owner: { select: { name: true, image: true, handle: true } },
        _count: { select: { favorites: true } },
      },
    })
  } catch { return [] }
}

export default async function HomePage() {
  const [recentPosts, popularPosts] = await Promise.all([getRecentPosts(), getPopularPosts()])

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-10 mb-12 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          スポーツ仲間を、もっと簡単に
        </h1>
        <p className="text-blue-100 text-xl mb-8">
          全国のスポーツサークル・イベント募集が見つかる
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/search" className="bg-white text-blue-700 font-bold py-3 px-8 rounded-xl text-lg hover:bg-blue-50 transition">
            🔍 募集を探す
          </Link>
          <Link href="/new" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-xl text-lg transition border border-blue-400">
            ＋ 募集を作る
          </Link>
        </div>
      </div>

      {/* Prefecture Grid */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">都道府県から探す</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {PREFECTURES.map((pref) => (
            <Link
              key={pref.slug}
              href={`/search?prefecture=${pref.slug}`}
              className="bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg p-2 text-center text-xs font-medium transition"
            >
              {pref.name.replace('都', '').replace('道', '').replace('府', '').replace('県', '')}
            </Link>
          ))}
        </div>
      </section>

      {/* Sports Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">スポーツから探す</h2>
        <div className="space-y-4">
          {SPORTS_CATEGORIES.map((cat) => (
            <div key={cat.category}>
              <div className="text-sm font-medium text-gray-500 mb-2">{cat.category}</div>
              <div className="flex flex-wrap gap-2">
                {cat.sports.map((sport) => (
                  <Link
                    key={sport}
                    href={`/search?q=${encodeURIComponent(sport)}`}
                    className="bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-full px-4 py-1.5 text-sm font-medium transition"
                  >
                    {sport}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">新着募集</h2>
            <Link href="/search?sort=new" className="text-blue-600 text-sm hover:underline">もっと見る →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Posts */}
      {popularPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">人気の募集</h2>
            <Link href="/search?sort=popular" className="text-blue-600 text-sm hover:underline">もっと見る →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
