import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PREFECTURES, SKILL_LEVELS, VIBES, GENDER_MIX, TIME_BANDS, DAYS_OF_WEEK } from '@/lib/constants'
import { postSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export default async function NewPostPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const sports = await prisma.sport.findMany({ orderBy: { name: 'asc' } }).catch(() => [])

  async function createPost(formData: FormData) {
    'use server'
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    const raw = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      sportId: formData.get('sportId') as string,
      prefecture: formData.get('prefecture') as string,
      city: formData.get('city') as string || undefined,
      placeText: formData.get('placeText') as string || undefined,
      skillLevel: formData.get('skillLevel') as string,
      vibe: formData.get('vibe') as string,
      genderMix: formData.get('genderMix') as string,
      ageBand: formData.get('ageBand') as string,
      feeMin: formData.get('feeMin') ? Number(formData.get('feeMin')) : null,
      feeMax: formData.get('feeMax') ? Number(formData.get('feeMax')) : null,
      scheduleText: formData.get('scheduleText') as string || undefined,
      daysOfWeek: formData.getAll('daysOfWeek').map(Number),
      timeBand: formData.get('timeBand') as string,
      capacityText: formData.get('capacityText') as string || undefined,
      requirementsText: formData.get('requirementsText') as string || undefined,
    }

    const parsed = postSchema.safeParse(raw)
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || 'Validation error')

    const post = await prisma.post.create({
      data: {
        ...parsed.data,
        slug: generateSlug(),
        ownerId: session.user.id,
      },
    })

    revalidatePath('/')
    redirect(`/p/${post.slug}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-black mb-8">📝 募集を作成する</h1>
      <form action={createPost} className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">

        <div>
          <label className="block text-sm font-medium mb-2">タイトル <span className="text-red-500">*</span></label>
          <input name="title" required minLength={5} maxLength={100}
            placeholder="例：東京・新宿でフットサル仲間を募集！初心者大歓迎"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">説明 <span className="text-red-500">*</span></label>
          <textarea name="description" required minLength={50} maxLength={5000} rows={8}
            placeholder="活動内容、雰囲気、参加条件など詳しく書いてください（50文字以上）"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">スポーツ <span className="text-red-500">*</span></label>
            <select name="sportId" required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">選択してください</option>
              {sports.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">都道府県 <span className="text-red-500">*</span></label>
            <select name="prefecture" required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">選択してください</option>
              {PREFECTURES.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">市区町村</label>
            <input name="city" placeholder="新宿区" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">活動場所</label>
            <input name="placeText" placeholder="新宿スポーツセンター" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">レベル</label>
            <select name="skillLevel" className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {SKILL_LEVELS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">雰囲気</label>
            <select name="vibe" className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {VIBES.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">性別</label>
            <select name="genderMix" className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {GENDER_MIX.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">参加費（最低）</label>
            <input name="feeMin" type="number" min={0} placeholder="0" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">参加費（最高）</label>
            <input name="feeMax" type="number" min={0} placeholder="3000" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">活動曜日</label>
          <div className="flex gap-2">
            {DAYS_OF_WEEK.map((day, i) => (
              <label key={i} className="flex flex-col items-center gap-1 cursor-pointer">
                <input type="checkbox" name="daysOfWeek" value={i} className="sr-only peer" />
                <span className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 text-sm peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 transition">
                  {day}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">時間帯</label>
          <select name="timeBand" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {TIME_BANDS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">スケジュール詳細</label>
          <input name="scheduleText" placeholder="毎週土曜 10:00〜12:00" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">募集人数</label>
            <input name="capacityText" placeholder="5〜10名" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">必要なもの</label>
            <input name="requirementsText" placeholder="動きやすい服装、シューズ" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition">
          📝 募集を投稿する
        </button>
      </form>
    </div>
  )
}
