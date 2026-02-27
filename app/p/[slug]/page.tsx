import { db } from '@/lib/db'
import { getPost } from '@/lib/queries'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PREFECTURES, SKILL_LEVELS, VIBES, GENDER_MIX, AGE_BANDS, TIME_BANDS, DAYS_OF_WEEK } from '@/lib/constants'
import Link from 'next/link'
import type { Metadata } from 'next'
import ApplyButton from '@/components/ApplyButton'
import FavoriteButton from '@/components/FavoriteButton'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: `${post.title} | SportsCircle+`,
    description: post.description.slice(0, 160),
    openGraph: { title: post.title, description: post.description.slice(0, 160) },
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()

  const post = await getPost(slug)
  if (!post || post.status === 'deleted') notFound()

  // Increment viewCount (fire-and-forget)
  void (async () => {
    try {
      await db.from('Post').update({ viewCount: (post.viewCount || 0) + 1 }).eq('id', post.id)
    } catch {}
  })()

  const pref = PREFECTURES.find((p) => p.slug === post.prefecture)
  let isFavorited = false
  if (session?.user?.id) {
    const { data: fav } = await db.from('Favorite').select('userId').eq('userId', session.user.id).eq('postId', post.id).maybeSingle()
    isFavorited = !!fav
  }

  const labels = [
    SKILL_LEVELS.find((s) => s.value === post.skillLevel)?.label,
    VIBES.find((v) => v.value === post.vibe)?.label,
    GENDER_MIX.find((g) => g.value === post.genderMix)?.label,
    AGE_BANDS.find((a) => a.value === post.ageBand)?.label,
  ].filter(Boolean)

  const days = (post.daysOfWeek || []).map((d: any) => DAYS_OF_WEEK[d]).join('・')
  const timeBandLabel = TIME_BANDS.find((t) => t.value === post.timeBand)?.label

  const threadsCount = (post.threadsCount || []).length

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: post.title,
    description: post.description.slice(0, 200),
    location: { '@type': 'Place', name: post.placeText || pref?.name || '未定' },
  }

  return (
    <div className="max-w-4xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        {' › '}
        <Link href="/search" className="hover:text-blue-600">検索</Link>
        {' › '}
        <span>{post.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {post.status === 'paused' && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-4 text-sm">
              この募集は現在一時停止中です
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded text-sm">
                {post.sport?.name}
              </span>
              {labels.map((label: any) => (
                <span key={label} className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm">
                  {label}
                </span>
              ))}
            </div>

            <h1 className="text-2xl font-black mb-4">{post.title}</h1>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{post.description}</p>

            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              {pref && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">エリア</div>
                  <div className="text-sm font-medium">{pref.name} {post.city && `・${post.city}`}</div>
                </div>
              )}
              {post.placeText && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">活動場所</div>
                  <div className="text-sm font-medium">{post.placeText}</div>
                </div>
              )}
              {days && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">活動曜日</div>
                  <div className="text-sm font-medium">{days}</div>
                </div>
              )}
              {timeBandLabel && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">時間帯</div>
                  <div className="text-sm font-medium">{timeBandLabel}</div>
                </div>
              )}
              {post.scheduleText && (
                <div className="col-span-2">
                  <div className="text-xs text-gray-400 mb-0.5">スケジュール詳細</div>
                  <div className="text-sm">{post.scheduleText}</div>
                </div>
              )}
              {(post.feeMin != null || post.feeMax != null) && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">参加費</div>
                  <div className="text-sm font-medium text-blue-700">
                    {post.feeMin != null ? `¥${post.feeMin.toLocaleString()}` : ''}
                    {post.feeMax != null ? `〜¥${post.feeMax.toLocaleString()}` : '〜'}
                  </div>
                </div>
              )}
              {post.capacityText && (
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">募集人数</div>
                  <div className="text-sm font-medium">{post.capacityText}</div>
                </div>
              )}
              {post.requirementsText && (
                <div className="col-span-2">
                  <div className="text-xs text-gray-400 mb-0.5">必要なもの・条件</div>
                  <div className="text-sm">{post.requirementsText}</div>
                </div>
              )}
            </div>
          </div>

          {(post.placeText || pref) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
              <h2 className="font-bold mb-2">アクセス</h2>
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent((post.placeText || '') + ' ' + (pref?.name || ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Google Mapsで確認する →
              </a>
            </div>
          )}

          <div className="text-center mt-4">
            <Link href={`/report?targetType=post&targetId=${post.id}`} className="text-xs text-gray-400 hover:text-red-400 transition">
              この投稿を通報する
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="text-sm text-gray-500 mb-4 space-y-1">
              <span>{post.viewCount}回閲覧</span>
              {' · '}
              <span>{post.favoriteCount || 0} お気に入り</span>
              {' · '}
              <span>{threadsCount}件の問い合わせ</span>
            </div>
            {session?.user && session.user.id !== post.ownerId && post.status === 'active' ? (
              <ApplyButton postId={post.id} ownerId={post.ownerId} />
            ) : !session ? (
              <Link href="/login" className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition">
                ログインして応募/質問する
              </Link>
            ) : null}

            {session?.user && (
              <div className="mt-3">
                <FavoriteButton postId={post.id} initialFavorited={isFavorited} />
              </div>
            )}

            {session?.user?.id === post.ownerId && (
              <div className="mt-3 flex gap-2">
                <Link href={`/edit/${post.id}`} className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg text-sm transition">
                  編集する
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 className="font-bold mb-3">主催者</h2>
            <Link href={`/u/${post.owner?.handle || post.owner?.id}`} className="flex items-center gap-3 hover:opacity-80 transition">
              {post.owner?.image ? (
                <img src={post.owner.image} alt={post.owner.name || ''} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {(post.owner?.name || 'U')[0]}
                </div>
              )}
              <div>
                <div className="font-medium text-sm">{post.owner?.name || '名無し'}</div>
                <div className="text-xs text-gray-400">信頼スコア: {post.owner?.trustScore || 0}</div>
              </div>
            </Link>
            {post.owner?.bio && <p className="text-sm text-gray-500 mt-3">{post.owner.bio}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
