import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { PREFECTURES } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportscircle.vercel.app'
  let postUrls: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.post.findMany({ where: { status: 'active' }, select: { slug: true, updatedAt: true } })
    postUrls = posts.map((p) => ({ url: `${baseUrl}/p/${p.slug}`, lastModified: p.updatedAt }))
  } catch {}

  const prefUrls = PREFECTURES.map((p) => ({ url: `${baseUrl}/search?prefecture=${p.slug}` }))

  return [
    { url: baseUrl },
    { url: `${baseUrl}/search` },
    ...prefUrls,
    ...postUrls,
  ]
}
