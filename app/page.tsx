import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const revalidate = 1800

const SPORTS_NAV = [
  'サッカー', 'フットサル', 'テニス', 'バスケットボール', 'バドミントン',
  'ランニング', 'ヨガ', 'サイクリング', '卓球', 'ダンス',
]

const PREFS = ['東京都', '神奈川県', '大阪府', '愛知県', '福岡県', '埼玉県', '千葉県', '兵庫県']

async function getRecentPosts() {
  try {
    return await prisma.post.findMany({
      where: { status: 'active' },
      take: 9,
      orderBy: { createdAt: 'desc' },
      include: {
        sport: true,
        owner: { select: { name: true, handle: true } },
        _count: { select: { favorites: true } },
      },
    })
  } catch { return [] }
}

function PostCard({ post }: { post: any }) {
  const skillMap: Record<string, string> = { beginner: '初心者可', intermediate: '中級', advanced: '上級', any: '誰でも' }
  const vibeMap: Record<string, string> = { casual: 'ゆるい', standard: '普通', serious: '本気' }

  return (
    <Link href={`/p/${post.slug}`}
      className="bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-xl p-4 transition flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
          {post.sport?.name}
        </span>
        <span className="text-xs text-gray-500">{skillMap[post.skillLevel] || post.skillLevel}</span>
        <span className="text-xs text-gray-500">{vibeMap[post.vibe] || post.vibe}</span>
      </div>
      <h3 className="font-bold text-sm leading-snug line-clamp-2">{post.title}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 flex-1">{post.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-1 border-t border-gray-100">
        <span className="truncate">{post.prefecture}</span>
        <span>{new Date(post.createdAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</span>
      </div>
    </Link>
  )
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts()

  return (
    <div>
      <div className="bg-blue-600 text-white rounded-2xl px-6 sm:px-10 py-10 sm:py-14 mb-8">
        <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
          スポーツ仲間を見つけよう
        </h1>
        <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-md">
          全国のスポーツサークル・仲間募集が一覧で見られる。参加もかんたん。
        </p>
        <div className="flex gap-3">
          <Link href="/search" className="bg-white text-blue-700 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition">
            募集を探す
          </Link>
          <Link href="/new" className="border border-white/50 text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-blue-500 transition">
            募集を作る
          </Link>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">スポーツから探す</h2>
        <div className="flex flex-wrap gap-2">
          {SPORTS_NAV.map(sport => (
            <Link key={sport} href={`/search?q=${encodeURIComponent(sport)}`}
              className="bg-white border border-gray-200 hover:border-blue-400 text-sm px-4 py-2 rounded-full transition hover:text-blue-600">
              {sport}
            </Link>
          ))}
          <Link href="/search" className="bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm px-4 py-2 rounded-full transition">
            もっと見る
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">地域から探す</h2>
        <div className="flex flex-wrap gap-2">
          {PREFS.map(pref => (
            <Link key={pref} href={`/search?prefecture=${pref.replace(/[都道府県]/g, '')}`}
              className="bg-white border border-gray-200 hover:border-blue-400 text-sm px-3 py-1.5 rounded-full transition hover:text-blue-600">
              {pref}
            </Link>
          ))}
          <Link href="/search" className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full">
            全国
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold">新着の募集</h2>
          <Link href="/search?sort=new" className="text-sm text-blue-600 hover:underline">全て見る</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentPosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
        {recentPosts.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-xl text-gray-500 text-sm">
            まだ募集がありません。最初の募集を作ってみましょう。
          </div>
        )}
      </section>
    </div>
  )
}
