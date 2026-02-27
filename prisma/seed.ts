import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SPORTS = [
  { slug: 'soccer', name: 'サッカー', category: '球技' },
  { slug: 'futsal', name: 'フットサル', category: '球技' },
  { slug: 'tennis', name: 'テニス', category: '球技' },
  { slug: 'basketball', name: 'バスケットボール', category: '球技' },
  { slug: 'volleyball', name: 'バレーボール', category: '球技' },
  { slug: 'badminton', name: 'バドミントン', category: '球技' },
  { slug: 'tabletennis', name: '卓球', category: '球技' },
  { slug: 'rugby', name: 'ラグビー', category: '球技' },
  { slug: 'handball', name: 'ハンドボール', category: '球技' },
  { slug: 'marathon', name: 'マラソン', category: 'アウトドア' },
  { slug: 'trail-run', name: 'トレイルラン', category: 'アウトドア' },
  { slug: 'hiking', name: '登山・ハイキング', category: 'アウトドア' },
  { slug: 'cycling', name: 'サイクリング', category: 'アウトドア' },
  { slug: 'yoga', name: 'ヨガ', category: 'フィットネス' },
  { slug: 'dance', name: 'ダンス', category: 'フィットネス' },
  { slug: 'fitness', name: 'フィットネス', category: 'フィットネス' },
  { slug: 'boxing', name: 'ボクシング', category: '格闘技' },
  { slug: 'judo', name: '柔道', category: '格闘技' },
  { slug: 'bjj', name: 'ブラジリアン柔術', category: '格闘技' },
  { slug: 'golf', name: 'ゴルフ', category: 'ゴルフ・その他' },
  { slug: 'baseball', name: '野球', category: 'ゴルフ・その他' },
  { slug: 'softball', name: 'ソフトボール', category: 'ゴルフ・その他' },
  { slug: 'swimming', name: '水泳', category: 'フィットネス' },
  { slug: 'climbing', name: 'スポーツクライミング', category: 'アウトドア' },
]

async function main() {
  for (const sport of SPORTS) {
    await prisma.sport.upsert({ where: { slug: sport.slug }, update: {}, create: sport })
  }

  await prisma.user.upsert({
    where: { email: 'admin@sportscircle.jp' },
    update: {},
    create: {
      email: 'admin@sportscircle.jp',
      name: '管理者',
      handle: 'admin',
      role: 'admin',
      trustScore: 100,
    },
  })

  const demo = await prisma.user.upsert({
    where: { email: 'demo@sportscircle.jp' },
    update: {},
    create: {
      email: 'demo@sportscircle.jp',
      name: 'デモユーザー',
      handle: 'demo_user',
      trustScore: 70,
    },
  })

  const futsalSport = await prisma.sport.findUnique({ where: { slug: 'futsal' } })
  const tennisSport = await prisma.sport.findUnique({ where: { slug: 'tennis' } })
  const yogaSport = await prisma.sport.findUnique({ where: { slug: 'yoga' } })
  const basketSport = await prisma.sport.findUnique({ where: { slug: 'basketball' } })
  const runSport = await prisma.sport.findUnique({ where: { slug: 'marathon' } })

  const DEMO_POSTS = [
    {
      title: '東京・渋谷でフットサル仲間募集！週1回・初心者歓迎',
      description: '渋谷区のスポーツセンターでフットサルをしています。毎週土曜の午前中に活動中。経験不問・初心者大歓迎です。みんなで楽しく汗を流しましょう！シューズと動きやすい服装があればOKです。',
      sport: futsalSport, prefecture: 'tokyo', city: '渋谷区', placeText: '渋谷区スポーツセンター',
      skillLevel: 'beginner', vibe: 'casual', feeMin: 500, feeMax: 1000, daysOfWeek: [6], timeBand: 'morning',
    },
    {
      title: '新宿・テニスサークル メンバー募集中 経験者向け',
      description: '新宿御苑近くのテニスコートで月2回活動中。中級者以上の方を募集しています。競技志向ではなくお互いに上達できる環境を目指しています。試合形式で楽しみながらスキルアップ！',
      sport: tennisSport, prefecture: 'tokyo', city: '新宿区', placeText: '新宿テニスコート',
      skillLevel: 'experienced', vibe: 'standard', feeMin: 1000, feeMax: 2000, daysOfWeek: [0, 6], timeBand: 'afternoon',
    },
    {
      title: '大阪・梅田ヨガサークル 女性限定・初心者歓迎',
      description: '梅田のスタジオで毎週水曜夜にヨガをしています。インストラクター資格保持者がリードします。初心者の方でも安心して参加できます。心身のリフレッシュに！',
      sport: yogaSport, prefecture: 'osaka', city: '大阪市北区', placeText: '梅田ヨガスタジオ',
      skillLevel: 'beginner', vibe: 'casual', genderMix: 'female', feeMin: 1500, feeMax: 2000, daysOfWeek: [3], timeBand: 'evening',
    },
    {
      title: '神奈川・横浜でバスケットボール！3×3メンバー募集',
      description: '横浜市内の公園で3×3バスケを楽しんでいます。週末の午後、2〜3時間程度。ガチではなくわいわい楽しむスタイル。ブランクある方も歓迎！',
      sport: basketSport, prefecture: 'kanagawa', city: '横浜市', placeText: '横浜市スポーツ公園',
      skillLevel: 'any', vibe: 'casual', feeMin: 0, feeMax: 0, daysOfWeek: [0, 6], timeBand: 'afternoon',
    },
    {
      title: '東京・皇居周辺ランニングクラブ 朝活メンバー募集',
      description: '毎朝7時に皇居外周をランニングするグループです。距離は約5km〜10km。初心者から上級者まで自分のペースで走れます。走った後に朝食を食べることも！',
      sport: runSport, prefecture: 'tokyo', city: '千代田区', placeText: '皇居外周',
      skillLevel: 'any', vibe: 'standard', feeMin: 0, feeMax: 0, daysOfWeek: [1, 2, 3, 4, 5], timeBand: 'morning',
    },
  ]

  for (const p of DEMO_POSTS) {
    if (!p.sport) continue
    const { sport, ...rest } = p
    const slug = `${sport.slug}-${Math.random().toString(36).substring(2, 8)}`
    await prisma.post.create({
      data: {
        ...rest,
        slug,
        sportId: sport.id,
        ownerId: demo.id,
        genderMix: (rest as { genderMix?: string }).genderMix || 'any',
        ageBand: 'any',
        daysOfWeek: rest.daysOfWeek || [],
        timeBand: rest.timeBand || 'any',
        feeMin: rest.feeMin ?? null,
        feeMax: rest.feeMax ?? null,
      },
    })
  }

  console.log('✅ Seed complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
