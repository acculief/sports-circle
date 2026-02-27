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

export default async function HomePage() {
  const recentPosts = await getRecentPosts()

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-10 mb-8 sm:mb-12 text-white">
        <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
          スポーツ仲間を、<br className="sm:hidden" />もっと簡単に
        </h1>
        <p className="text-blue-100 text-sm sm:text-xl mb-6">
          全国のスポーツサークル・イベント募集が見つかる
        </p>
        <div className="flex gap-3">
          <Link href="/search" className="flex-1 sm:flex-none text-center bg-white text-blue-700 font-bold py-3 px-6 rounded-xl text-sm sm:text-base hover:bg-blue-50 transition">
            🔍 募集を探す
          </Link>
          <Link href="/new" className="flex-1 sm:flex-none text-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl text-sm sm:text-base transition border border-blue-400">
            ＋ 募集を作る
          </Link>
        </div>
      </div>

      {/* Prefecture Grid */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-2xl font-bold mb-4">都道府県から探す</h2>
        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-1.5 sm:gap-2">
          {PREFECTURES.map((pref) => (
            <Link
              key={pref.slug}
              href={`/search?prefecture=${pref.slug}`}
              className="bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg p-1.5 sm:p-2 text-center text-xs font-medium transition leading-tight"
            >
              {pref.name.replace('都', '').replace('道', '').replace('府', '').replace('県', '')}
            </Link>
          ))}
        </div>
      </section>

      {/* Sports */}
      <section className="mb-8">
        <h2 className="text-lg sm:text-2xl font-bold mb-4">スポーツから探す</h2>
        <div className="space-y-3">
          {SPORTS_CATEGORIES.map((cat) => (
            <div key={cat.category}>
              <div className="text-xs font-medium text-gray-500 mb-1.5">{cat.category}</div>
              <div className="flex flex-wrap gap-1.5">
                {cat.sports.map((sport) => (
                  <Link
                    key={sport}
                    href={`/search?q=${encodeURIComponent(sport)}`}
                    className="bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-full px-3 py-1 text-xs sm:text-sm font-medium transition"
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
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-2xl font-bold">新着募集</h2>
            <Link href="/search?sort=new" className="text-blue-600 text-sm hover:underline">もっと見る →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post as Parameters<typeof PostCard>[0]['post']} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
