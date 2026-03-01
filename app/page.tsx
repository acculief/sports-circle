import Link from 'next/link'
import { getPosts } from '@/lib/queries'
import { SPORTS_CATEGORIES } from '@/lib/constants'

export const revalidate = 1800

const SPORTS_NAV = [
  'サッカー', 'フットサル', 'テニス', 'バスケットボール', 'バドミントン',
  'ランニング', 'ヨガ', 'サイクリング', '卓球', 'ダンス',
]

const PREFS = ['東京都', '神奈川県', '大阪府', '愛知県', '福岡県', '埼玉県', '千葉県', '兵庫県']

const SPORT_ICONS: Record<string, string> = {
  '球技': '⚽',
  'アウトドア': '🏃',
  '格闘技': '🥊',
  'フィットネス': '🧘',
  'ゴルフ・その他': '⛳',
}

const FAQ_ITEMS = [
  {
    q: 'SportsCircle+は無料で使えますか？',
    a: 'はい、基本機能は完全無料でご利用いただけます。募集の作成・閲覧・応募もすべて無料です。',
  },
  {
    q: '社会人でなくても登録できますか？',
    a: '学生の方もご利用いただけます。ただし掲載されているサークルは社会人向けが多いため、募集要項をよくご確認ください。',
  },
  {
    q: 'どのようなスポーツの募集がありますか？',
    a: 'サッカー・フットサル・テニス・バスケットボール・バドミントン・ランニング・ヨガなど50種類以上のスポーツに対応しています。',
  },
  {
    q: '全国の募集を探せますか？',
    a: 'はい、全国47都道府県の募集を検索できます。エリアを絞って近くの仲間を探しましょう。',
  },
  {
    q: 'スキルレベルはどう確認しますか？',
    a: '各募集には「初心者歓迎」「レベル不問」「経験者向け」などのスキルレベルが表示されています。自分に合ったレベルの募集を探せます。',
  },
  {
    q: '募集を作るにはどうすればよいですか？',
    a: 'ログイン後、「募集を作る」ボタンから作成できます。スポーツ種目・エリア・スキルレベル・活動ペースなどを設定するだけで簡単に作成できます。',
  },
]

async function getRecentPosts() {
  try {
    return await getPosts({ status: 'active', limit: 9, orderBy: 'createdAt' })
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

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-gray-100 last:border-0 py-4">
      <dt className="font-bold text-sm text-gray-900 mb-1.5 flex gap-2">
        <span className="text-blue-600 shrink-0">Q.</span>
        {q}
      </dt>
      <dd className="text-sm text-gray-600 leading-relaxed pl-6">
        {a}
      </dd>
    </div>
  )
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts()

  return (
    <div>
      {/* Hero */}
      <div className="bg-blue-600 text-white rounded-2xl px-6 sm:px-10 py-10 sm:py-14 mb-8">
        <h1 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
          スポーツ仲間を見つけよう
        </h1>
        <p className="text-blue-100 text-sm sm:text-base mb-6 max-w-md">
          全国のスポーツサークル・仲間募集が一覧で見られる。参加もかんたん。
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/search" className="bg-white text-blue-700 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition">
            募集を探す
          </Link>
          <Link href="/new" className="border border-white/50 text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-blue-500 transition">
            募集を作る
          </Link>
        </div>
      </div>

      {/* スポーツから探す */}
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

      {/* スポーツカテゴリ */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">カテゴリから探す</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SPORTS_CATEGORIES.map(cat => (
            <div key={cat.category} className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="text-2xl mb-1">{SPORT_ICONS[cat.category] || '🏅'}</div>
              <p className="text-xs font-bold text-gray-700 mb-2">{cat.category}</p>
              <ul className="space-y-0.5">
                {cat.sports.slice(0, 4).map(s => (
                  <li key={s}>
                    <Link href={`/search?q=${encodeURIComponent(s)}`}
                      className="text-xs text-gray-500 hover:text-blue-600 transition">
                      {s}
                    </Link>
                  </li>
                ))}
                {cat.sports.length > 4 && (
                  <li className="text-xs text-gray-400">+{cat.sports.length - 4}種目</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 地域から探す */}
      <section className="mb-8">
        <h2 className="text-base font-bold mb-3">地域から探す</h2>
        <div className="flex flex-wrap gap-2">
          {PREFS.map(pref => (
            <Link key={pref} href={`/search?prefecture=${pref.replace(/[都道府県]/g, '')}`}
              className="bg-white border border-gray-200 hover:border-blue-400 text-sm px-3 py-1.5 rounded-full transition hover:text-blue-600">
              {pref}
            </Link>
          ))}
          <Link href="/search" className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full hover:bg-gray-200 transition">
            全国
          </Link>
        </div>
      </section>

      {/* 新着の募集 */}
      <section className="mb-10">
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

      {/* 使い方 */}
      <section className="mb-10 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
        <h2 className="text-base font-bold mb-6 text-center">かんたん3ステップ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '1', icon: '🔍', title: '募集を探す', desc: 'スポーツ・エリア・スキルレベルで絞り込んで、気になる募集を見つけよう' },
            { step: '2', icon: '👤', title: 'アカウント作成', desc: 'Googleアカウントでかんたん登録。プロフィールを設定して準備完了' },
            { step: '3', icon: '🙌', title: '応募して参加', desc: 'メッセージを送って詳細を確認。あとは当日楽しむだけ！' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-lg mx-auto mb-3">
                {item.step}
              </div>
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-base font-bold mb-4">よくある質問</h2>
        <div className="bg-white border border-gray-200 rounded-xl px-4 sm:px-6">
          <dl>
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </dl>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">その他のご質問は募集ページの問い合わせフォームからどうぞ</p>
        </div>
      </section>
    </div>
  )
}
