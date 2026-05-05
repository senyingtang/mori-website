# 專案現況摘要

> 更新目的：對齊規格階段 **001～018A-1** 與 **019**（部署文件）；非完整 changelog。

---

## 已完成階段（對應規格編號）

| 區間 | 主題 |
|------|------|
| 001～004 | Supabase schema、Auth trigger、Storage、bootstrap、contact_submissions |
| 020-C（本階段） | FeaturedCoaches 主教練版型、`coaches.is_main_featured`、後台主教練設定 |
| 005～014 | 前台首頁／地圖 MVP、據點場次、教練商品、SEO／FAQ、聯絡表單與後台 |
| 015～016 | contact 表單、後台篩選、honeybot、最短送出時間 |
| 017 | Launch checklist、demo seed SQL |
| 018A / 018A-1 | Storage 上傳、前台 Logo／OG／卡片圖與 fallback |
| 019 | 部署指南、README、本文件 |

---

## 已完成功能（精簡）

- **前台**：首頁區塊、據點／場次／教練／商品／聯絡／政策頁；Taiwan SVG 地圖 MVP；RWD  
- **Auth**：Email／Password 註冊登入；會員／LINE 綁定頁保護；Header 依角色顯示後台  
- **後台**：site／home sections／SEO／policy／map cities／locations／sessions／coaches（含「首頁主教練」設定）／products／FAQs／contact submissions；權限（site_settings 僅 admin 階級可改）  
- **SEO**：`seo_settings`、`buildPageMetadata`、JSON-LD（首頁／列表等）、canonical／noindex  
- **聯絡**：表單寫入 DB、後台篩選與狀態  
- **Storage**：後台上傳 Logo／OG／頭像／商品圖；前台顯示與 OG 預設圖邏輯  
- **文件**：`launch-readiness-checklist.md`、`deployment-guide.md`、README  

---

## 尚未完成／未實作（依規格刻意延後）

- LINE OAuth、LINE 登入綁定  
- 臨打正式報名、候補遞補、付款／綠界  
- Email 寄送（聯絡表單僅 DB）  
- 商品詳情頁、購物車、結帳、訂單  
- Three.js／R3F 3D 台灣地圖  
- **`/auth/callback`** 路由（預留給 Email confirm／OAuth；見 `deployment-guide.md`）  

---

## 建議下一階段

1. **Staging**：依 `docs/deployment-guide.md` 完成 Vercel + Supabase 變數與 Redirect 驗收。  
2. **產品化**：商品詳情頁 schema 與路由，或 **Email**（聯絡通知／會員信）擇一開 Phase。  
3. **LINE**：OAuth 與 `line_bindings` 流程（需新 migration 與 App 設定）。  

更多細項見 **`docs/badminton_brand_website_spec.md`**。
