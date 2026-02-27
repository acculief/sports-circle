# SportsCircle+ — 社会人スポーツサークル募集プラットフォーム

net-menber.com 上位互換の、スポーツ仲間募集サイト。

## 機能

- 🔍 強力な検索（都道府県・スポーツ・レベル・雰囲気・時間帯など）
- 📝 募集投稿（詳細条件設定）
- 💬 スレッド型メッセージ
- ❤️ お気に入り
- 🔞 スパム対策（外部連絡先ブロック）
- 🛡️ 通報・モデレーション
- 🗺️ Google Maps リンク自動生成
- 🔎 SEO最適化（OGP・JSON-LD・sitemap）

## ローカル起動

```bash
# 1. 依存インストール
npm install

# 2. 環境変数設定
cp .env.example .env.local
# .env.local を編集

# 3. DBマイグレーション
npx prisma migrate dev --name init

# 4. シードデータ投入
npx tsx prisma/seed.ts

# 5. 起動
npm run dev
```

## 環境変数設定

| 変数 | 説明 |
|------|------|
| `DATABASE_URL` | PostgreSQL接続URL（Supabase pooler推奨） |
| `DIRECT_URL` | Prisma migrate用直接接続URL |
| `AUTH_SECRET` | NextAuth秘密鍵（`openssl rand -hex 32`で生成） |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth（Google Cloud Console） |
| `RESEND_API_KEY` | メールログイン用（resend.com） |
| `NEXT_PUBLIC_SITE_URL` | 本番サイトURL |

## Vercelデプロイ

1. GitHubにpush
2. Vercelでリポジトリを連携
3. 環境変数をVercelダッシュボードで設定
4. `npx prisma migrate deploy` でDB適用
5. `npx tsx prisma/seed.ts` でシードデータ投入
