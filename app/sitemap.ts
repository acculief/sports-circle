import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { PREFECTURES } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportscircle.vercel.app'
  let postUrls: MetadataRoute.Sitemap = []
  try {
    const { data: posts } = await db
      .from('Post')
      .select('slug, updatedAt')
      .eq('status', 'active')
    postUrls = (posts || []).map((p: any) => ({ url: `${baseUrl}/p/${p.slug}`, lastModified: p.updatedAt }))
  } catch {}

  const prefUrls = PREFECTURES.map((p) => ({ url: `${baseUrl}/search?prefecture=${p.slug}` }))

  return [
    { url: baseUrl },
    { url: `${baseUrl}/search` },
    ...prefUrls,
    ...postUrls,
  ]
}
