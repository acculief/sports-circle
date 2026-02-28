import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import Script from "next/script"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const noto = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-noto', weight: ['400', '500', '700', '900'] })

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  title: { default: 'SportsCircle+ | 社会人スポーツサークル募集', template: '%s | SportsCircle+' },
  description: '社会人のスポーツサークル・仲間募集。全国47都道府県対応。サッカー・テニス・バスケ・ランニングなど50以上のスポーツ。',
  metadataBase: new URL('https://sports-circle.vercel.app'),
  verification: { google: '0uJTSoLifNf9F30GBAdAstHG5n6Ci6kGC29csJZbdRM' },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://sports-circle.vercel.app',
    siteName: 'SportsCircle+',
    title: 'SportsCircle+ | 社会人スポーツサークル募集',
    description: '社会人のスポーツサークル・仲間募集。全国対応。サッカー・テニス・バスケ・ランニングなど。',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'SportsCircle+' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportsCircle+ | 社会人スポーツサークル募集',
    description: '社会人のスポーツサークル・仲間募集。全国対応。',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="ja">
      <body className={`${inter.variable} ${noto.variable} font-sans bg-gray-50 text-gray-900 min-h-screen`}>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center h-14 gap-4 sm:gap-6">
              <Link href="/" className="text-lg font-black text-blue-600 shrink-0 tracking-tight">
                SportsCircle+
              </Link>
              <nav className="hidden sm:flex items-center gap-1 flex-1">
                <Link href="/search" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition">
                  募集を探す
                </Link>
              </nav>
              <div className="ml-auto flex items-center gap-2">
                {session ? (
                  <>
                    <Link href="/messages" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition">
                      メッセージ
                    </Link>
                    <Link href="/mypage" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition">
                      マイページ
                    </Link>
                    <Link href="/new" className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="hidden sm:inline">募集を作る</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition">
                      ログイン
                    </Link>
                    <Link href="/new" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                      募集を作る
                    </Link>
                  </>
                )}
              </div>
              <Link href="/search" className="sm:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
        <footer className="bg-white border-t border-gray-200 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-xs text-gray-500">
            <p className="font-bold text-gray-700 mb-1">SportsCircle+</p>
            <p>&copy; 2024 SportsCircle+</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
