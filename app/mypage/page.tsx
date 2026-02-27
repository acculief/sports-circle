import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getMyPosts, getFavoritePosts } from '@/lib/queries'
import Link from 'next/link'
import PostCard from '@/components/PostCard'

export const revalidate = 0

export default async function MyPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [myPosts, favoritePosts, userResult] = await Promise.all([
    getMyPosts(session.user.id).catch(() => []),
    getFavoritePosts(session.user.id).catch(() => []),
    db.from('User').select('*').eq('id', session.user.id).maybeSingle(),
  ])

  const user = userResult.data

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-black mb-8">マイページ</h1>

      {/* Profile */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-4">
          {session.user.image ? (
            <img src={session.user.image} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {(session.user.name || 'U')[0]}
            </div>
          )}
          <div>
            <div className="font-bold text-xl">{session.user.name || '名無し'}</div>
            <div className="text-gray-500">{session.user.email}</div>
            {user?.bio && <p className="text-sm text-gray-600 mt-1">{user.bio}</p>}
          </div>
        </div>
      </div>

      {/* My Posts */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">自分の投稿 ({myPosts.length})</h2>
          <Link href="/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            ＋ 新しく募集する
          </Link>
        </div>
        {myPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-200">
            まだ投稿がありません
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myPosts.map((post) => <PostCard key={post.id} post={post as any} />)}
          </div>
        )}
      </section>

      {/* Favorites */}
      <section>
        <h2 className="text-xl font-bold mb-4">お気に入り ({favoritePosts.length})</h2>
        {favoritePosts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-white rounded-xl border border-gray-200">
            お気に入りがありません
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoritePosts.map((post) => post && <PostCard key={post.id} post={post as any} />)}
          </div>
        )}
      </section>
    </div>
  )
}
