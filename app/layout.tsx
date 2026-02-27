import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { signOut } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const noto = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto', weight: ['400', '500', '700', '900'] })

export const metadata: Metadata = {
  title: 'SportsCircle+ | 社会人スポーツサークル募集',
  description: '社会人のスポーツサークル・イベント募集サイト。全国47都道府県、サッカー・テニス・バスケ等40種類以上のスポーツから探せる。',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="ja">
      <body className={`${inter.variable} ${noto.variable} font-sans bg-gray-50 min-h-screen`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link href="/" className="text-xl font-black text-blue-600 tracking-tight whitespace-nowrap">
              ⚽ SportsCircle+
            </Link>
            <div className="flex-1" />
            <nav className="flex items-center gap-3 text-sm">
              <Link href="/search" className="text-gray-600 hover:text-blue-600 transition">検索</Link>
              {session ? (
                <>
                  <Link href="/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                    ＋ 募集する
                  </Link>
                  <Link href="/mypage" className="text-gray-600 hover:text-blue-600 transition">マイページ</Link>
                  <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }) }}>
                    <button className="text-gray-400 hover:text-gray-600 text-xs transition">ログアウト</button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
                  ログイン
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <footer className="border-t border-gray-200 mt-16 py-8 text-center text-gray-400 text-sm">
          <p>© 2024 SportsCircle+ — 社会人スポーツサークル募集プラットフォーム</p>
        </footer>
      </body>
    </html>
  )
}
