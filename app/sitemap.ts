import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { PREFECTURES, SPORTS_CATEGORIES } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sports-circle.vercel.app'
  let postUrls: MetadataRoute.Sitemap = []
  try {
    const { data: posts } = await db
      .from('Post')
      .select('slug, updatedAt')
      .eq('status', 'active')
    postUrls = (posts || []).map((p: any) => ({
      url: `${baseUrl}/p/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {}

  const prefUrls = PREFECTURES.map((p) => ({
    url: `${baseUrl}/search?prefecture=${p.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  const allSports = SPORTS_CATEGORIES.flatMap(c => c.sports)
  const sportUrls = allSports.map((s) => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(s)}`,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  return [
    { url: baseUrl, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/search`, changeFrequency: 'daily', priority: 0.9 },
    ...prefUrls,
    ...sportUrls,
    ...postUrls,
  ]
}
