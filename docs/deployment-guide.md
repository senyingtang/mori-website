# 部署指南（Vercel × Supabase × Staging／Production）

> 專案：森映球團形象網站（mori-website）  
> 本文件涵蓋 **019：Staging 上線檢查與正式部署準備**；**未**包含 LINE OAuth、正式報名、付款。

---

## 1. 部署前必要條件

在連接 Vercel 或切換 Production 前，請確認：

- [ ] 已於 Supabase 依序套用 migration **`001_initial_cms_auth_schema.sql`～`004_contact_submissions.sql`**
- [ ] 已執行 **`supabase/seeds/demo_seed.sql`**（示範環境）或已手動建立正式 CMS／據點／商品等資料
- [ ] 已透過 **`bootstrap_super_admin`** 或等效方式建立第一個 **super_admin**（見 [§6 Admin 初始化](#6-admin-初始化)）
- [ ] **Storage** buckets 已存在且 policy 可寫入（見 [§5](#5-supabase-storage-檢查)）
- [ ] 本機 **`npm run build`** 通過

詳細上線前勾選亦可對照 [`launch-readiness-checklist.md`](./launch-readiness-checklist.md)。

---

## 2. 本機環境變數

於專案根目錄建立 `.env.local`（勿提交金鑰），參考 `.env.example`：

| 變數 | 說明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 專案 **Project URL**（`https://xxxxx.supabase.co`） |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon / public** key（前端與 RLS 使用；**勿**使用 service_role） |
| `NEXT_PUBLIC_SITE_URL` | 本機建議：`http://localhost:3000`（與實際開發埠一致；影響 canonical、OG `url`） |

---

## 3. Vercel 環境變數

於 **Vercel Project → Settings → Environment Variables** 新增相同三項：

| 變數 | Production | Preview（建議） |
|------|------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | 正式 Supabase 專案 URL | 與 Staging／Prod 一致或獨立 Staging 專案 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 對應專案 anon key | 同上 |
| `NEXT_PUBLIC_SITE_URL` | **正式網域**（例：`https://www.example.com`，無尾隨斜線） | **Preview 網址**（例：`https://mori-website-xxx.vercel.app`） |

**提醒：**

- **Preview** 每次部署網址可能不同；若 Auth Redirect 需涵蓋所有 Preview，可於 Supabase 使用萬用字元（見官方文件 **Redirect URL patterns**）或固定 Staging 網域。
- **`NEXT_PUBLIC_SITE_URL`** 會影響 **`generateMetadata`／canonical／Open Graph `url`**；Preview 與 Production 請分開設定，避免正式站 canonical 指到 vercel.app。

---

## 4. Supabase Auth 設定

於 **Supabase Dashboard → Authentication → URL Configuration**：

### Site URL

- 開發：`http://localhost:3000`
- Staging／Preview：Vercel 給予的預覽 URL（或自訂 staging 網域）
- Production：正式網域根 URL

### Redirect URLs（Additional Redirect URLs）

至少將下列 **模式** 納入（依實際網域替換）：

| 用途 | 範例 |
|------|------|
| 本機 | `http://localhost:3000` |
| 本機 callback（預留） | `http://localhost:3000/auth/callback` |
| Vercel Preview | `https://<preview-project>.vercel.app` |
| Vercel Preview callback（預留） | `https://<preview-project>.vercel.app/auth/callback` |
| Production | `https://your-domain.com` |
| Production callback（預留） | `https://your-domain.com/auth/callback` |

**說明：** 目前 App Router 主要使用 **Email／Password** 與 **cookie session**，未必已有 **`/auth/callback`** 路由；若專案中尚未建立該路徑，上述 **`/auth/callback`** 仍建議先加入 Redirect 允許清單，供未來 **Email confirmation 確認連結、OAuth、Magic Link** 等階段使用，避免屆時登入導向被拒。

---

## 5. Supabase Storage 檢查

Migration **`003_storage_and_admin_bootstrap.sql`** 應已建立：

| Bucket | 用途 | 公開讀取 | 大小／MIME（migration 內） |
|--------|------|----------|---------------------------|
| `public-assets` | Logo、OG 圖等 | 是（public bucket） | 5MB；png／jpeg／webp／**svg** |
| `coach-avatars` | 教練頭像 | 是 | 5MB；png／jpeg／webp（**無 svg**） |
| `product-images` | 商品主圖 | 是 | 8MB；png／jpeg／webp |

**Policy 要點（預期）：**

- **匿名／登入使用者**：可 **select**（讀取公開物件）
- **已登入且 `is_editor_or_admin()`**：可 **insert／update／delete** 上述三個 bucket

**驗收：**

- 後台上傳後，前台以 **`getPublicUrl`** 取得的 URL 可在瀏覽器直接開啟圖片。
- **SVG** 僅應出現在 **`public-assets`**（後台上傳驗證與 bucket `allowed_mime_types` 一致）。

---

## 6. Admin 初始化

1. 於前台 **註冊**第一個帳號（會建立 `profiles`／`members`）。
2. 開啟 **Supabase → SQL Editor**，執行（將 email 改成你的帳號）：

```sql
select public.bootstrap_super_admin('your-email@example.com');
```

**注意：**

- 僅在 **尚無任何 `super_admin`** 時會成功；已有 super_admin 時函式會拒絕執行。
- 成功後請 **重新登入**（或清 cookie 後再登入），使 JWT／session 反映角色。
- 登入後 **Header** 應出現 **後台** 連結（editor／admin／super_admin）。

---

## 7. 部署流程

1. 將程式碼 **push** 至 GitHub（或 GitLab／Bitbucket 等 Vercel 支援來源）。
2. **Vercel**：Import Project → 選取 repo → Framework Preset：**Next.js**。
3. 設定 **Environment Variables**（§3），Production / Preview 分別檢查。
4. **Deploy**；於 **Build Logs** 確認 `npm run build` 成功、無環境變數缺失。
5. 開啟 **Preview URL**，快速 smoke test（§8）。
6. Production：綁定網域後，將 **`NEXT_PUBLIC_SITE_URL`** 改為正式網址並 **Redeploy**。

---

## 8. Staging 驗收流程（路由）

建議在 Preview／Staging 逐一開啟（應可載入、無 500）：

| 區域 | 路徑 |
|------|------|
| 前台 | `/`、`/locations`、`/sessions`、`/coaches`、`/products`、`/contact`、`/privacy-policy`、`/terms`、`/login`、`/register`、`/member-dashboard`、`/line-binding` |
| 後台 | `/admin`、`/admin/contact-submissions`（及其餘已啟用之 CMS 子路徑） |

---

## 9. 表單測試

- [ ] **`/contact`**：正常填寫送出成功訊息。
- [ ] **防垃圾**：honeypot／3 秒內快速送出時前台仍顯示成功，但後台 **不**應出現異常大量垃圾列（可搭配筛选查看）。
- [ ] **`/admin/contact-submissions`**：可看到新留言；**status**／**admin_note** 可更新並儲存。

---

## 10. Auth 測試

- [ ] **註冊**→ DB 有對應 **profiles**／**members**
- [ ] **登入**／**登出**
- [ ] 未登入訪問 **`/member-dashboard`**、**`/line-binding`** → 導向登入
- [ ] 未登入訪問 **`/admin`** → 無法進入（redirect）
- [ ] **一般 member** 無法使用後台
- [ ] **super_admin**（或 editor／admin 依設計）可進 **`/admin`**

---

## 11. SEO／OG 測試

- [ ] 各頁 **title**、**meta description**（來自 `seo_settings` 或 fallback）
- [ ] **canonical** 指向預期網域（檢查 `NEXT_PUBLIC_SITE_URL`）
- [ ] **OG**：`og:title`、`og:description`、**og:image**（頁面專用或全站 `brand.og_image_url`／logo fallback）
- [ ] **noindex**：login／register／member_dashboard／line_binding 等不應被索引（或依 DB）
- [ ] 首頁／列表頁 **JSON-LD**（`view-source` 搜尋 `application/ld+json`）
- [ ] **LINE／Facebook 分享偵錯工具**（輸入 Staging／Prod URL）預覽縮圖與文案

---

## 12. 尚未上線功能提醒

以下項目**尚未**於本專案完整實作，對外公告或營運需知情：

- LINE OAuth 與 LINE 登入綁定
- 臨打 **正式報名**（名額、候補規則）
- **候補／遞補通知**（推播）
- **Email 通知**（聯絡表單僅寫入 DB）
- **付款**／綠界（或任何金流）
- **商品詳情頁**（單一 slug）
- **購物車**／**結帳**／**訂單**
- **Three.js／React Three Fiber** 3D 台灣地圖（目前為 SVG MVP）

---

## 相關文件

- [`launch-readiness-checklist.md`](./launch-readiness-checklist.md) — 上線前勾選
- [`current-status.md`](./current-status.md) — 功能進度摘要（若已建立）
- 根目錄 [`README.md`](../README.md) — 本機開發與指令
