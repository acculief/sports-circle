export const PREFECTURES = [
  { slug: 'hokkaido', name: '北海道' },
  { slug: 'aomori', name: '青森県' },
  { slug: 'iwate', name: '岩手県' },
  { slug: 'miyagi', name: '宮城県' },
  { slug: 'akita', name: '秋田県' },
  { slug: 'yamagata', name: '山形県' },
  { slug: 'fukushima', name: '福島県' },
  { slug: 'ibaraki', name: '茨城県' },
  { slug: 'tochigi', name: '栃木県' },
  { slug: 'gunma', name: '群馬県' },
  { slug: 'saitama', name: '埼玉県' },
  { slug: 'chiba', name: '千葉県' },
  { slug: 'tokyo', name: '東京都' },
  { slug: 'kanagawa', name: '神奈川県' },
  { slug: 'niigata', name: '新潟県' },
  { slug: 'toyama', name: '富山県' },
  { slug: 'ishikawa', name: '石川県' },
  { slug: 'fukui', name: '福井県' },
  { slug: 'yamanashi', name: '山梨県' },
  { slug: 'nagano', name: '長野県' },
  { slug: 'shizuoka', name: '静岡県' },
  { slug: 'aichi', name: '愛知県' },
  { slug: 'mie', name: '三重県' },
  { slug: 'shiga', name: '滋賀県' },
  { slug: 'kyoto', name: '京都府' },
  { slug: 'osaka', name: '大阪府' },
  { slug: 'hyogo', name: '兵庫県' },
  { slug: 'nara', name: '奈良県' },
  { slug: 'wakayama', name: '和歌山県' },
  { slug: 'tottori', name: '鳥取県' },
  { slug: 'shimane', name: '島根県' },
  { slug: 'okayama', name: '岡山県' },
  { slug: 'hiroshima', name: '広島県' },
  { slug: 'yamaguchi', name: '山口県' },
  { slug: 'tokushima', name: '徳島県' },
  { slug: 'kagawa', name: '香川県' },
  { slug: 'ehime', name: '愛媛県' },
  { slug: 'kochi', name: '高知県' },
  { slug: 'fukuoka', name: '福岡県' },
  { slug: 'saga', name: '佐賀県' },
  { slug: 'nagasaki', name: '長崎県' },
  { slug: 'kumamoto', name: '熊本県' },
  { slug: 'oita', name: '大分県' },
  { slug: 'miyazaki', name: '宮崎県' },
  { slug: 'kagoshima', name: '鹿児島県' },
  { slug: 'okinawa', name: '沖縄県' },
]

export const SPORTS_CATEGORIES = [
  {
    category: '球技',
    sports: ['サッカー', 'フットサル', 'バスケットボール', 'バレーボール', 'テニス', 'バドミントン', '卓球', 'ラグビー', 'アメフト', 'ハンドボール'],
  },
  {
    category: 'アウトドア',
    sports: ['マラソン', 'トレイルラン', '登山', 'ハイキング', 'サイクリング', 'トライアスロン'],
  },
  {
    category: '格闘技',
    sports: ['ボクシング', '柔道', '空手', 'ブラジリアン柔術', 'キックボクシング', 'レスリング'],
  },
  {
    category: 'フィットネス',
    sports: ['ヨガ', 'ピラティス', 'ダンス', 'フィットネス', 'クロスフィット', '水泳'],
  },
  {
    category: 'ゴルフ・その他',
    sports: ['ゴルフ', '野球', 'ソフトボール', 'アルティメット', 'フリスビー', 'スポーツクライミング'],
  },
]

export const SKILL_LEVELS = [
  { value: 'beginner', label: '初心者歓迎' },
  { value: 'any', label: 'レベル不問' },
  { value: 'experienced', label: '経験者向け' },
]

export const VIBES = [
  { value: 'casual', label: 'ゆるめ' },
  { value: 'standard', label: '標準' },
  { value: 'serious', label: 'ガチ' },
]

export const GENDER_MIX = [
  { value: 'any', label: '不問' },
  { value: 'male', label: '男性のみ' },
  { value: 'female', label: '女性のみ' },
  { value: 'mixed', label: '男女混合' },
]

export const AGE_BANDS = [
  { value: 'any', label: '年齢不問' },
  { value: '20s', label: '20代中心' },
  { value: '30s', label: '30代中心' },
  { value: '40s', label: '40代中心' },
  { value: '50plus', label: '50代以上' },
]

export const TIME_BANDS = [
  { value: 'morning', label: '朝（〜10時）' },
  { value: 'afternoon', label: '昼（10〜17時）' },
  { value: 'evening', label: '夕方（17〜20時）' },
  { value: 'night', label: '夜（20時〜）' },
  { value: 'any', label: '時間不問' },
]

export const DAYS_OF_WEEK = ['日', '月', '火', '水', '木', '金', '土']
