import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { auth } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const noto = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto', weight: ['400', '500', '700', '900'] })

export const metadata: Metadata = {
  title: 'SportsCircle+ | 社会人スポーツサークル募集',
  description: '社会人のスポーツサークル・イベント募集サイト。全国47都道府県対応。',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="ja">
      <body className={`${inter.variable} ${noto.variable} font-sans bg-gray-50 min-h-screen`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-black text-blue-600 tracking-tight">
                ⚽ SportsCircle+
              </Link>
              <nav className="flex items-center gap-1 sm:gap-3">
                <Link href="/search" className="p-2 text-gray-500 hover:text-blue-600 transition" title="検索">
                  <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline text-sm font-medium">検索</span>
                </Link>
                {session ? (
                  <>
                    <Link href="/new" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="hidden sm:inline">募集する</span>
                    </Link>
                    <Link href="/mypage" className="p-2 text-gray-500 hover:text-blue-600 transition" title="マイページ">
                      <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="hidden sm:inline text-sm font-medium">マイページ</span>
                    </Link>
                    <Link href="/messages" className="p-2 text-gray-500 hover:text-blue-600 transition" title="メッセージ">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    ログイン
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">{children}</main>
        <footer className="border-t border-gray-200 mt-12 py-6 text-center text-gray-400 text-xs">
          <p>© 2024 SportsCircle+</p>
        </footer>
      </body>
    </html>
  )
}
