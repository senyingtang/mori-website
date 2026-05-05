# 森映球團形象網站（mori-website）

羽球團品牌官網：Next.js App Router、Supabase（Auth／Postgres／Storage／RLS）、Tailwind CSS。預留 CMS、會員與未來電商擴充。

## 技術棧

- **Next.js** 15（App Router、Server Actions）
- **TypeScript**、**Tailwind CSS**
- **Supabase**：Auth、資料庫、Storage（公開素材／教練頭像／商品圖）

## 本機啟動

```bash
npm install
npm run dev
```

瀏覽 <http://localhost:3000>（預設埠以終端機為準）。

## 環境變數

複製 `.env.example` 為 `.env.local` 並填入：

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key（勿提交 service_role） |
| `NEXT_PUBLIC_SITE_URL` | 本機建議 `http://localhost:3000` |

## Supabase Migrations

於 Supabase SQL 或 CLI 依序套用：

1. `supabase/migrations/001_initial_cms_auth_schema.sql`
2. `supabase/migrations/002_auth_profile_member_trigger.sql`
3. `supabase/migrations/003_storage_and_admin_bootstrap.sql`
4. `supabase/migrations/004_contact_submissions.sql`

## Demo Seed（可選）

示範資料（可重跑，詳見檔內註解）：

- `supabase/seeds/demo_seed.sql`

## 部署

完整步驟、Vercel 變數、Auth Redirect、Storage 驗收見：

**[`docs/deployment-guide.md`](docs/deployment-guide.md)**

上線前勾選亦可參考 **`docs/launch-readiness-checklist.md`**。

## Scripts

| 指令 | 說明 |
|------|------|
| `npm run dev` | 開發模式（Turbopack） |
| `npm run build` | 正式建置 |
| `npm run start` | 啟動 production server |
| `npm run lint` | ESLint（Next.js） |
