import { db } from './db'

export type Post = {
  id: string
  slug: string
  title: string
  description: string
  sportId: string
  prefecture: string
  city: string | null
  skillLevel: string
  vibe: string
  genderMix: string
  ageBand: string
  feeMin: number | null
  feeMax: number | null
  scheduleText: string | null
  timeBand: string
  status: string
  ownerId: string
  viewCount: number
  favoriteCount: number
  createdAt: string
  sport?: Sport
  owner?: Pick<User, 'name' | 'handle' | 'image'>
  _count?: { favorites: number }
}

export type Sport = { id: string; slug: string; name: string; category: string }
export type User = { id: string; name: string | null; email: string | null; handle: string | null; prefecture: string | null; image: string | null; bio: string | null; trustScore: number }

export async function getPosts(opts: {
  status?: string
  prefecture?: string
  sportId?: string
  skillLevel?: string
  vibe?: string
  timeBand?: string
  q?: string
  ownerId?: string
  limit?: number
  offset?: number
  orderBy?: 'createdAt' | 'viewCount' | 'favoriteCount'
  order?: 'asc' | 'desc'
} = {}) {
  let query = db.from('Post').select(`
    *,
    sport:Sport(*),
    owner:User!Post_ownerId_fkey(name, handle, image)
  `)

  if (opts.status) query = query.eq('status', opts.status)
  if (opts.prefecture) query = query.eq('prefecture', opts.prefecture)
  if (opts.sportId) query = query.eq('sportId', opts.sportId)
  if (opts.skillLevel) query = query.eq('skillLevel', opts.skillLevel)
  if (opts.vibe) query = query.eq('vibe', opts.vibe)
  if (opts.timeBand) query = query.eq('timeBand', opts.timeBand)
  if (opts.ownerId) query = query.eq('ownerId', opts.ownerId)
  if (opts.q) query = query.or(`title.ilike.%${opts.q}%,description.ilike.%${opts.q}%`)

  const col = opts.orderBy || 'createdAt'
  query = query.order(col, { ascending: (opts.order || 'desc') === 'asc' })
  if (opts.limit) query = query.limit(opts.limit)
  if (opts.offset != null && opts.limit) query = query.range(opts.offset, opts.offset + opts.limit - 1)

  const { data, error } = await query
  if (error) { console.error('getPosts error:', error); return [] }
  return (data || []) as Post[]
}

export async function countPosts(opts: { status?: string; prefecture?: string; sportId?: string; skillLevel?: string; vibe?: string; timeBand?: string; q?: string } = {}) {
  let query = db.from('Post').select('id', { count: 'exact', head: true })
  if (opts.status) query = query.eq('status', opts.status)
  if (opts.prefecture) query = query.eq('prefecture', opts.prefecture)
  if (opts.sportId) query = query.eq('sportId', opts.sportId)
  if (opts.skillLevel) query = query.eq('skillLevel', opts.skillLevel)
  if (opts.vibe) query = query.eq('vibe', opts.vibe)
  if (opts.timeBand) query = query.eq('timeBand', opts.timeBand)
  if (opts.q) query = query.or(`title.ilike.%${opts.q}%,description.ilike.%${opts.q}%`)
  const { count } = await query
  return count || 0
}

export async function getSports() {
  const { data } = await db.from('Sport').select('*').order('name')
  return (data || []) as Sport[]
}

export async function getPost(slug: string) {
  const { data } = await db
    .from('Post')
    .select(`
      *,
      sport:Sport(*),
      owner:User!Post_ownerId_fkey(id, name, image, handle, bio, trustScore),
      images:PostImage(id, url, sortOrder),
      threadsCount:Thread(id)
    `)
    .eq('slug', slug)
    .single()
  return data as any
}

export async function getMyPosts(ownerId: string) {
  const { data } = await db
    .from('Post')
    .select('*, sport:Sport(*), owner:User!Post_ownerId_fkey(name, image, handle)')
    .eq('ownerId', ownerId)
    .neq('status', 'deleted')
    .order('createdAt', { ascending: false })
  return (data || []) as Post[]
}

export async function getFavoritePosts(userId: string) {
  const { data } = await db
    .from('Favorite')
    .select('createdAt, post:Post(*, sport:Sport(*), owner:User!Post_ownerId_fkey(name, image, handle))')
    .eq('userId', userId)
    .order('createdAt', { ascending: false })
    .limit(10)
  return (data || []).map((f: any) => f.post).filter(Boolean) as Post[]
}
