# Supabase 全新資料庫重置與初始化指引

本文件協助在**更換全新 Supabase Project** 後，使用既有 **migrations（001～004）** 與 **demo_seed.sql** 重新初始化，**不重寫資料表設計**、**不變更網站功能**。本流程不包含 LINE OAuth、付款與報名系統。

---

## 1. 建立新的 Supabase Project

請至 [Supabase Dashboard](https://supabase.com/dashboard) 建立新專案，並記錄以下資訊（後續本機與 Vercel 會用到）：

| 項目 | 用途 |
|------|------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public key** | `NEXT_PUBLIC_SUPABASE_ANON_KEY`（僅此密鑰可放進 `NEXT_PUBLIC_*`） |
| **Database password** | 連線／CLI／備份用（勿寫入前端） |
| **Project reference ID** | Dashboard 網址或設定中的專案識別（CLI `link`、支援問答時常用） |

---

## 2. 更新本機環境變數

在專案根目錄建立或更新 **`.env.local`**（若無則由 `.env.example` 複製後改名）：

```env
NEXT_PUBLIC_SUPABASE_URL=（新的 Supabase Project URL）
NEXT_PUBLIC_SUPABASE_ANON_KEY=（新的 Supabase anon key）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**注意：**

- **不要**將 **service_role** key 放入任何 **`NEXT_PUBLIC_*`** 變數。
- **不要**將 `.env.local` commit 至 Git（專案 `.gitignore` 已排除 `.env*.local`）。

---

## 3. 套用 migrations

請**嚴格依序**執行下列檔案（同一順序失敗時請先修正錯誤再繼續下一支）：

1. `supabase/migrations/001_initial_cms_auth_schema.sql`
2. `supabase/migrations/002_auth_profile_member_trigger.sql`
3. `supabase/migrations/003_storage_and_admin_bootstrap.sql`
4. `supabase/migrations/004_contact_submissions.sql`

### 方式 A：Supabase Dashboard SQL Editor

1. 開啟 **SQL Editor**。
2. 依序開啟本 repo 中上述四個檔案，**整份複製**貼上後執行。
3. 每支執行成功後再執行下一支。

### 方式 B：Supabase CLI（大方向）

若本機已安裝 [Supabase CLI](https://supabase.com/docs/guides/cli)：

- 可將專案與遠端連結（`supabase link --project-ref <ref>`）後，使用 `db push` 或 `migration up` 等指令套用 `supabase/migrations` 內 SQL。  
- **本文件不預設您已執行 `link`**；若尚未 link，請改用**方式 A**，或先完成 CLI 登入與 link 後再依官方文件操作。

---

## 4. 執行 demo seed（`demo_seed.sql`）

在 **四支 migration 全部成功** 後，於 **SQL Editor**（或具資料庫權限的客戶端）執行：

`supabase/seeds/demo_seed.sql`

### 行為說明

- **會**補入／更新示範資料，涵蓋（依 seed 內容）：**site_settings**、**seo_settings**、**home_sections**、**locations**、**sessions**、**map_city_settings**、**coaches**、**products**、**faqs**、**policy_pages** 等（實際表名以檔案為準）。
- **不會**建立 `auth.users`（須透過網站註冊或 Dashboard Auth）。
- **不會**建立真實營運會員資料。
- **FAQ**：seed 會依檔案說明刪除並重建部分 page_key 的示範 FAQ；**正式環境若已有自訂 FAQ，請勿在該資料庫直接重跑 demo seed**，或改為僅手動匯入所需段落。

---

## 5. 建立第一個管理員

1. 本機啟動網站後，前往 **`/register`** 註冊一個帳號（會寫入 Supabase Auth 與 `profiles`）。
2. 到 Supabase **SQL Editor** 執行（將 email 改成您註冊的信箱）：

   ```sql
   select public.bootstrap_super_admin('你的 email');
   ```

3. **登出**後再**重新登入**（讓前端取得更新後的角色）。
4. 頁首應出現 **「後台」** 連結。
5. 應可進入 **`/admin`**。

**提醒：**

- `bootstrap_super_admin` 設計為：**僅在尚無任何 `super_admin` 時**才能成功；若已存在 `super_admin`，會失敗，屬**預期的安全行為**。

---

## 6. Supabase Auth 設定

於 Dashboard：**Authentication → URL Configuration**

### Site URL

- **本機開發**：`http://localhost:3000`
- 部署 **Vercel Preview / Production** 後，請改為對應的正式網址或 Preview 網址。

### Redirect URLs

至少加入：

- `http://localhost:3000`
- `http://localhost:3000/auth/callback`

若已部署至 Vercel，另加入（將網域替換為實際值）：

- `https://你的-vercel-preview-url`
- `https://你的-vercel-preview-url/auth/callback`
- `https://你的正式網域`
- `https://你的正式網域/auth/callback`

**說明：** 目前應用程式中的 **`/auth/callback`** 路由為**預留**（未來 Email 確認／OAuth 回跳用）。若尚未實作 callback 頁面，可先保留於 Redirect URLs，不影響本 repo 既有密碼註冊／登入流程的主要路徑。

---

## 7. Supabase Storage 檢查

Migration **`003_storage_and_admin_bootstrap.sql`** 應已建立下列 buckets：

| Bucket | 公開讀取 | 上傳權限（摘要） | MIME 備註 |
|--------|----------|------------------|-----------|
| **public-assets** | 是（anon / authenticated 可依 policy 讀取） | `editor` / `admin` / `super_admin`（透過 `is_editor_or_admin()`） | 允許 **svg**（含 `image/svg+xml`） |
| **coach-avatars** | 是 | 同上 | **不**允許 svg |
| **product-images** | 是 | 同上 | **不**允許 svg |

請於 Dashboard **Storage** 確認三個 bucket 存在，必要時上傳測試檔驗證 RLS 與 MIME 限制是否與 migration 一致。

---

## 8. 更新 Vercel 環境變數

於 **Vercel Project → Settings → Environment Variables** 更新（各環境分別設定）：

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 新 Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 新 anon key |
| `NEXT_PUBLIC_SITE_URL` | **Preview** 可填該次 Preview 的完整網址；**Production** 填正式網域 |

**注意：** `NEXT_PUBLIC_SITE_URL` 會影響 **canonical**、**OG URL** 等；Preview 與 Production 請勿共用錯誤的網址。

變更環境變數後請重新觸發 **Vercel 部署**，使新設定生效。

---

## 9. GitHub／Vercel 部署檢查與功能驗證

### 9.1 安全 push 與 repo 內容


- **`.env.local`**：已由 `.gitignore` 排除，勿將任何密鑰提交至 repo。
- **`supabase/migrations/*.sql`**、**`supabase/seeds/demo_seed.sql`**、**`docs/**`**：應可正常 commit（不含密鑰）。
- **`package.json`**：維持既有 scripts（`build`、`dev`、`lint` 等）即可配合 Vercel 建置。

### 9.2 新 DB 與應用程式對應（建議手動驗證）

完成以上步驟後，建議依序確認：

1. **Auth**：註冊／登入／登出正常。
2. **RLS**：未登入僅能讀取公開資料；後台操作需具備對應角色。
3. **Storage**：後台上傳圖片、前台／公開 URL 讀取素材。
4. **CMS 後台**：`/admin` 各頁能讀寫與 revalidate 預期內容。
5. **前台**：首頁、據點、場次、教練、商品、聯絡、政策頁等能讀取新 DB 資料。

---

## 相關文件

- `docs/deployment-guide.md` — 整體部署與上線檢查  
- `docs/launch-readiness-checklist.md` — 上線前核對清單  
- `README.md` — 本機啟動與 migrations 順序摘要  
