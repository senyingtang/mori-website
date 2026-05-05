# 正式上線前檢查清單（Launch Readiness）

> 專案：森映球團形象網站（mori-website）  
> 用途：上線前逐項自檢，與 Vercel / Supabase 設定核對。  
> 註：本專案目前**未**實作 LINE OAuth、付款、正式報名系統；清單中「尚未實作功能」一節有明列。

---

## 1. 環境變數檢查

### 1.1 應用程式（Next.js / Vercel）

- [ ] `NEXT_PUBLIC_SUPABASE_URL`：與 Supabase 專案 **Project URL** 一致（`https://xxxxx.supabase.co`）
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`：使用 Supabase **anon / public** key（非 service_role）
- [ ] `NEXT_PUBLIC_SITE_URL`：正式站之 **Canonical 根網址**（例：`https://www.example.com`，**無**結尾斜線與多餘路徑），用於 SEO canonical 與絕對連結

### 1.2 Supabase 主控台

- [ ] **Project URL** 與 `NEXT_PUBLIC_SUPABASE_URL` 相同
- [ ] **Auth → URL Configuration**
  - [ ] **Site URL**：建議設為正式站根網址（與 `NEXT_PUBLIC_SITE_URL` 一致或與登入導向政策一致）
  - [ ] **Redirect URLs**：加入正式站與預覽網域（如 Vercel `*.vercel.app`）之 `/login`、`/register`、`/auth/callback`（若日後啟用）等需導回之路徑

### 1.3 Vercel

- [ ] **Environment Variables** 中已設定上述三個變數（Production / Preview 依環境分開檢查）
- [ ] Production 與 Preview 的 `NEXT_PUBLIC_SITE_URL` 是否分別指向正確網域

---

## 2. Supabase Migration 檢查

依序在 Supabase SQL 或本機 `supabase db push` 套用，**順序不可錯**：

| 檔案 | 用途 |
|------|------|
| `001_initial_cms_auth_schema.sql` | 建立 enums、`profiles`/`members`/`site_settings`/`home_sections`/`locations`/`sessions`/`coaches`/`products`/`faqs`/`seo_settings`/`policy_pages`/`map_city_settings` 等表、RLS、種子資料骨架 |
| `002_auth_profile_member_trigger.sql` | `auth.users` 新增使用者時自動建立 `profiles`、`members`；`line_bindings` 狀態同步 |
| `003_storage_and_admin_bootstrap.sql` | Storage buckets、Storage RLS、`bootstrap_super_admin` 輔助函式 |
| `004_contact_submissions.sql` | `contact_submissions` 表、索引、RLS（公開 insert、後台讀寫） |
| `005_coach_main_featured.sql` | `coaches.is_main_featured`（首頁主教練），以及對應索引 |

- [ ] 五支 migration 均已成功套用，無錯誤遺留

---

## 3. Auth / 權限檢查

- [ ] **註冊**：新使用者建立後，`profiles`、`members` 是否各有一筆對應資料（依註冊流程與 trigger）
- [ ] **bootstrap_super_admin**：是否已在安全環境執行過（僅限建立第一位 super_admin，詳見 migration 註解）
- [ ] **角色**：`super_admin` / `admin` / `editor` / `member` 行為是否符合預期（後台 `site_settings` 僅 admin 階級可改，內容管理 editor 可改等）
- [ ] **`/admin`**：未登入或非編輯以上角色是否無法進入（redirect）
- [ ] **`/member-dashboard`、`/line-binding`**：未登入是否導向登入頁

---

## 4. 前台路由檢查

於正式／預覽環境手動或以瀏覽器開啟（應可載入，無 500）：

| 路由 | 說明 |
|------|------|
| `/` | 首頁 |
| `/locations` | 據點 |
| `/sessions` | 場次 |
| `/coaches` | 教練 |
| `/products` | 商品 |
| `/contact` | 聯絡表單 |
| `/privacy-policy` | 隱私權政策 |
| `/terms` | 使用條款 |
| `/login` | 登入 |
| `/register` | 註冊 |
| `/member-dashboard` | 會員中心（需登入） |
| `/line-binding` | LINE 綁定（需登入） |

- [ ] 以上路由皆可開啟（需登入頁需驗證未登入時行為）

---

## 5. 後台路由檢查

以具 **editor / admin / super_admin** 權限之帳號登入後檢查：

| 路由 |
|------|
| `/admin` |
| `/admin/site-settings` |
| `/admin/home-sections` |
| `/admin/seo-settings` |
| `/admin/policy-pages` |
| `/admin/map-cities` |
| `/admin/locations` |
| `/admin/sessions` |
| `/admin/coaches` |
| `/admin/products` |
| `/admin/faqs` |
| `/admin/contact-submissions` |

- [ ] 未授權使用者無法進入；各頁可載入且表單／列表可用
- [ ] `/admin/coaches` 可設定「首頁主教練」（只會有一位；設定後其他教練會自動取消主教練）

---

## 6. SEO 檢查

- [ ] **每頁 title / description**：由 `seo_settings` 或 `lib/seo/metadata.ts` fallback 產出
- [ ] **canonical**：`NEXT_PUBLIC_SITE_URL` + 路徑；或由 DB `canonical_url` 覆寫
- [ ] **OG**：`og_title` / `og_description` / `og_image_url`（未填時部分由 title/description 遞補）
- [ ] **noindex**：`login`、`register`、`member_dashboard`、`line_binding` 等頁於 DB 或 fallback 為 noindex
- [ ] **FAQPage JSON-LD**：首頁／據點／場次／教練／商品等依實作注入
- [ ] **Organization / WebSite JSON-LD**：首頁等
- [ ] **BreadcrumbList / ItemList JSON-LD**：據點、場次等列表頁

---

## 7. CTA 檢查

建議以「點擊後網址合理、無 404」為準：

- [ ] **Hero CTA**：臨打／教學導向 `/sessions` 篩選參數
- [ ] **ServiceIntro CTA**：服務介紹區塊連結
- [ ] **TaiwanServiceMap CTA**：依 `map_city_settings.cta_href`（或預設策略）
- [ ] **PopularVenues CTA**：據點／場次／聯絡
- [ ] **CoachCard CTA**：LINE 或 `/contact` 帶來源參數
- [ ] **ProductCard CTA**：`/contact` 商品通知等
- [ ] **SessionCard CTA**：`/contact` 帶場次來源
- [ ] **LocationCard CTA**：`/contact` 帶據點來源
- [ ] **FinalCTA**：尾屏行動按鈕
- [ ] **Header CTA**：導覽、登入／後台入口
- [ ] **Footer links**：政策、社交、聯絡等

---

## 8. RWD 檢查

- [ ] 首頁 Hero（手機／平板／桌面排版）
- [ ] TaiwanServiceMap 手機 chips + 列表 fallback
- [ ] `/sessions` 篩選 UI
- [ ] `/locations` 篩選 UI
- [ ] `/coaches` 篩選 UI
- [ ] `/products` 篩選 UI
- [ ] `/contact` 表單可填寫與送出
- [ ] Admin 後台側欄與表單在小螢幕可捲動、可操作

---

## 9. 表單與資料寫入檢查

- [ ] **`/contact`**：正常送出寫入 `contact_submissions`
- [ ] **Honeypot**（`website` 有值）：前台顯示成功，**不**寫入 DB
- [ ] **3 秒內送出**：同上（靜默成功、不寫入）
- [ ] **後台** `/admin/contact-submissions`：可檢視、篩選、更新 **status** / **admin_note**

---

## 10. 上線前尚未實作功能（預期缺口）

以下項目**尚未**於本專案完整實作，上線簡報／營運需知情：

- LINE OAuth 綁定與 LINE 登入
- 正式臨打報名系統（候補、名額、取消規則等）
- 候補遞補通知（推播／站內）
- 付款／綠界（或任何金流）
- 商品詳情頁（單一 slug 商品頁）
- 購物車／結帳／訂單
- Three.js / React Three Fiber 3D 台灣地圖（目前為 SVG MVP）
- Email 通知（聯絡表單僅寫入 DB，未寄信）

---

## 附錄：目前程式內建之路由盤點（App Router）

以下依 `app/` 目錄整理（動態路由除外），供與實際部署核對：

**前台**：`/`, `/locations`, `/sessions`, `/coaches`, `/products`, `/contact`, `/privacy-policy`, `/terms`, `/login`, `/register`, `/member-dashboard`, `/line-binding`

**後台**：`/admin`, `/admin/site-settings`, `/admin/home-sections`, `/admin/seo-settings`, `/admin/policy-pages`, `/admin/map-cities`, `/admin/locations`, `/admin/sessions`, `/admin/coaches`, `/admin/products`, `/admin/faqs`, `/admin/contact-submissions`

---

## 附錄：SEO `page_key` 齊全度（建議）

前台使用的 `seo_settings.page_key` 建議至少包含：

`home`, `locations`, `sessions`, `coaches`, `products`, `contact`, `privacy_policy`, `terms`, `login`, `register`, `member_dashboard`, `line_binding`

（登入相關頁建議 **`noindex = true`**。）

可用 `supabase/seeds/demo_seed.sql` 或後台 **SEO 設定** 補齊。
