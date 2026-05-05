# 羽球團形象網站規劃書

> 專案方向：羽球團品牌形象官網，預留未來轉型為電商網站，並具備 CMS 後端可管理前端內容、Hero 互動地圖、教練團、商品、頁面 SEO 與會員系統擴充能力。

---

## 一、是否需要將會員登入、註冊等頁面一同設計？

**建議：需要，而且應該從第一版就先納入資訊架構與 UI 設計。**

原因是這個網站並不是單純的形象網站，而是未來會串接 LINE 報名、臨打場次、教學預約、候補通知、會員綁定、商品購買與訂單紀錄的網站。若一開始沒有規劃會員系統，後續要轉型為電商或球友會員平台時，容易造成前端路由、資料庫結構、權限邏輯與 UI 流程重做。

### 建議第一階段先設計但不一定全部開放

第一版可以先完成會員頁面的設計稿與資料結構預留，功能可以分階段開放。

建議先規劃以下頁面：

```txt
/login                 會員登入
/register              會員註冊
/forgot-password       忘記密碼
/member-dashboard      會員中心
/member-profile        個人資料
/my-sessions           我的臨打報名
/my-lessons            我的教學預約
/my-orders             我的商品訂單
/line-binding          LINE 綁定頁
```

### 第一版最重要的會員功能

第一版不一定要做完整電商會員，但至少建議保留：

```txt
LINE 綁定
會員資料
臨打報名紀錄
候補狀態
教學預約紀錄
商品訂單預留
```

### 會員系統與網站定位的關係

會員系統可以讓網站從單純形象網站升級為：

```txt
球團品牌官網
羽球報名平台
教學預約平台
LINE 會員綁定中心
未來商品電商會員中心
```

因此，會員登入與註冊頁面建議一起設計，否則後續要做報名、商品、訂單與會員權益時會比較麻煩。

---

## 二、CMS 後端需求：前端內容需要可以由後台管理

此站建議必須具備 CMS 後端，讓管理者可以不改程式碼就調整網站前端內容。

### CMS 後端的目的

CMS 後端主要用來管理：

```txt
首頁 Hero 文案
3D 台灣地圖縣市據點
教學 / 臨打 Tab 顯示內容
教練團資料
熱門場地
臨打場次
教學課程
商品資料
FAQ
SEO meta
CTA 按鈕
頁面內容
Footer 資訊
隱私權政策與使用條款
```

### 建議 CMS 管理項目

#### 1. 首頁設定

```txt
Hero 主標題
Hero 副標
Hero CTA 文字
Hero CTA 連結
背景視覺設定
首頁顯示區塊排序
```

#### 2. 3D 台灣地圖設定

```txt
縣市名稱
服務類型：教學 / 臨打 / 兩者皆有
是否啟用
發光顏色
Hover 卡片標題
Hover 卡片描述
場地列表
按鈕文字
按鈕連結
```

#### 3. 教練團管理

```txt
教練姓名
教練照片
教學地區
教學年資
擅長項目
適合程度
教學風格
是否顯示於首頁
排序
```

#### 4. 場地與場次管理

```txt
場地名稱
縣市
區域
地址
服務類型
開團時間
程度限制
用球
價格
人數上限
是否顯示
```

#### 5. 商品管理

```txt
商品名稱
商品圖片
商品分類
商品價格
商品狀態：草稿 / 即將開賣 / 上架 / 售完
庫存數量
商品描述
SEO 設定
```

#### 6. SEO 管理

```txt
每頁 Title
Meta Description
OG Title
OG Description
OG Image
Canonical URL
Schema 設定
```

#### 7. 系統設定

```txt
LINE 官方帳號連結
社群連結
品牌 Logo
網站主色
CTA 按鈕文字
客服 Email
Footer 內容
```

### CMS 技術建議

此專案可以有三種做法：

#### 方案 A：Supabase 自製後台

適合高度客製化，尤其未來要結合 LINE 報名、會員、臨打、商品與付款。

```txt
Next.js 前端
Supabase Database
Supabase Auth
自製 Admin Dashboard
```

優點：

```txt
彈性最高
可與會員系統、臨打系統、LINE 綁定直接整合
資料結構完全可控
未來可擴充 SaaS 或多球團系統
```

缺點：

```txt
初期開發成本較高
需要設計權限與後台 UI
```

#### 方案 B：Headless CMS，例如 Strapi / Directus

適合內容管理較多、希望快速建立後台的情境。

優點：

```txt
後台成形快
內容管理友善
適合非工程人員操作
```

缺點：

```txt
若未來要高度整合報名、LINE、付款與會員，仍可能需要客製開發
```

#### 方案 C：WordPress Headless

適合如果原本團隊已熟悉 WordPress。

優點：

```txt
內容管理容易
SEO 外掛成熟
後台使用者熟悉
```

缺點：

```txt
互動地圖、會員報名系統、LINE 串接、電商擴充可能會變得較複雜
效能與資料結構彈性較不如自製系統
```

### 最推薦方案

如果這個網站未來會結合：

```txt
LINE 綁定
會員中心
臨打報名
候補通知
教學預約
商品販售
付款紀錄
球友資料
```

建議採用：

```txt
Next.js + Supabase + 自製 CMS 後台
```

這樣最符合未來擴充方向。

---

# 三、網站定位

網站不只是單純介紹球團，而是要做成：

**羽球品牌形象官網 + 教學 / 臨打據點查詢平台 + 未來球團自創商品電商入口**

核心目標：

1. 建立球團專業形象。
2. 讓新球友快速理解「可以去哪裡打球、哪裡上課」。
3. 展示教練團、活動氛圍與品牌特色。
4. 預留商品販售區塊，未來可轉成完整電商。
5. 具備 SEO 結構，能佈局「桃園羽球教學」、「中壢羽球臨打」、「羽球教練推薦」、「羽球團報名」等關鍵字。

---

# 四、整體視覺風格

## 主色調

### 主色：紫色

建議使用深紫與霓虹紫做品牌主視覺。

```css
--primary-purple: #6D28D9;
--deep-purple: #1E103D;
--neon-purple: #A855F7;
```

紫色代表：

```txt
專業
神秘感
科技感
年輕化
品牌辨識度高
```

## 副色調

### 藍色：科技、速度、冷光感

```css
--electric-blue: #2563EB;
--cyan-blue: #38BDF8;
```

可用在按鈕 hover、地圖光暈、動態線條。

### 紅色：熱血、競技、警示重點

```css
--energy-red: #EF4444;
--hot-red: #F43F5E;
```

可用在「熱門場次」、「即將額滿」、「新開團」等標籤。

### 白色：乾淨、資訊清楚

```css
--white: #FFFFFF;
--soft-white: #F8FAFC;
```

用於文字、卡片、背景層次。

---

# 五、網站整體設計方向

## 建議風格

**暗色系科技運動風**

背景以深紫、深藍、黑紫漸層為主，搭配光線、粒子、羽毛球軌跡、球拍網線紋理。

### 視覺關鍵字

```txt
3D
霓虹光
羽球軌跡
速度線
玻璃擬態卡片
動態地圖
球場燈光
競技感
科技報名系統感
```

---

# 六、網站架構 Sitemap

建議先做成以下頁面：

```txt
首頁 /
教練團介紹 /coaches
全部商品 /products
會員登入 /login
會員註冊 /register
會員中心 /member-dashboard
聯絡我們 /contact
隱私權政策 /privacy-policy
使用條款 /terms
```

未來電商擴充可以再增加：

```txt
商品分類 /product-category/badminton-gear
商品詳情 /products/product-name
購物車 /cart
結帳 /checkout
會員中心 /account
訂單查詢 /orders
優惠券 /coupons
```

---

# 七、Header 設計

## 桌機版 Header

左側：

```txt
球團 Logo｜森映球團 / 羽森桃園
```

中間選單：

```txt
首頁
教學據點
臨打場次
教練團
商品專區
聯絡我們
```

右側 CTA：

```txt
立即報名
LINE 綁定
會員登入
```

## Header 視覺

建議使用半透明玻璃效果：

```css
background: rgba(30, 16, 61, 0.72);
backdrop-filter: blur(16px);
border-bottom: 1px solid rgba(168, 85, 247, 0.25);
```

滾動後 Header 可以變成更深色，增加穩定感。

---

# 八、首頁 Hero Section 設計

這是整個網站最重要的區塊。

## Hero Section 主概念

**一張 3D 台灣地圖，呈現球團在全台的教學與臨打據點。**

畫面建議：

```txt
左側：品牌標語與 CTA
右側：3D 台灣互動地圖
```

## Hero 左側內容

### 主標題 H1

```txt
用更聰明的方式，找到你的下一場羽球對決
```

或更有品牌感：

```txt
森映球團｜讓羽球，不只是運動，而是一種生活節奏
```

若要做 SEO，可用：

```txt
桃園羽球教學與臨打報名平台｜森映球團
```

## Hero 副標

```txt
整合羽球教學、臨打開團、候補通知與 LINE 報名系統，讓球友不用再文字接龍，也能快速找到適合自己的球場與教練。
```

## Hero CTA

主要按鈕：

```txt
查看臨打場次
```

次要按鈕：

```txt
預約羽球教學
```

第三個文字連結：

```txt
了解教練團 →
```

---

# 九、3D 台灣互動地圖設計

## 功能需求

Hero 右側放置一個 3D 台灣地圖。

地圖上方有兩個 Tab：

```txt
教學
臨打
```

使用者切換 Tab 後，不同縣市會發光。

## Tab 狀態範例

### 教學 Tab

發光縣市：

```txt
桃園市
台北市
新北市
宜蘭縣
```

### 臨打 Tab

發光縣市：

```txt
桃園市
新北市
台中市
高雄市
```

未來可以由 CMS 後台管理。

## 互動邏輯

### 當使用者切換「教學」

1. 台灣地圖切換成藍紫光。
2. 有教學服務的縣市發光。
3. 縣市上方出現小型光點。
4. Hover 發光縣市時，出現教學場地卡片。

### 當使用者切換「臨打」

1. 台灣地圖切換成紅紫光。
2. 有臨打場次的縣市發光。
3. 熱門縣市可以有脈衝動畫。
4. Hover 後出現臨打場地卡片。

## Hover 場地卡片內容

### 教學卡片

```txt
桃園市｜羽森桃園教學據點

服務類型：成人羽球教學 / 初階班 / 進階班
教練：Jason 教練、Allen 教練
適合程度：新手～中階
上課地點：中壢 / 桃園 / 八德
按鈕：查看教學課程
```

### 臨打卡片

```txt
桃園市｜中壢飆球俱樂部

開團時間：每週三 20:00–22:00
程度限制：4–6 級
用球：RSL No.4
費用：$200 / 次
按鈕：查看臨打場次
```

## 3D 地圖視覺效果

建議特效：

1. 台灣地圖微微旋轉。
2. 縣市邊界有霓虹描邊。
3. 發光縣市有呼吸燈效果。
4. 滑鼠靠近時縣市浮起。
5. 背景有羽球飛行軌跡。
6. 地圖底部有圓形雷達掃描光圈。
7. 場地卡片使用 glassmorphism 玻璃質感。

## 3D 地圖技術建議

### 最推薦方案

```txt
Three.js + React Three Fiber + SVG / GeoJSON 台灣縣市資料
```

原因：

```txt
可以做真正 3D
可控制縣市 hover
可切換發光狀態
可搭配動畫與粒子效果
後續可串接資料庫與 CMS
```

### 替代方案

若預算較低，可以使用：

```txt
SVG 台灣地圖 + CSS 發光動畫
```

優點是開發較快、SEO 頁面效能較好；缺點是 3D 感較弱。

---

# 十、首頁區塊規劃

首頁建議順序如下：

```txt
1. Hero Section：3D 台灣互動地圖
2. 品牌特色區：為什麼選擇此球團
3. 教學 / 臨打服務切換區
4. 熱門場地與開團時間
5. 教練團精選介紹
6. LINE 報名系統特色
7. 球友評價 / 活動照片
8. 商品預留區
9. 常見問題 FAQ
10. 最終 CTA
```

---

# 十一、首頁詳細區塊設計

## 1. Hero Section

功能：

```txt
建立第一印象
展示 3D 台灣互動據點
引導報名或預約教學
```

視覺：

```txt
深紫背景
3D 台灣發光地圖
羽球軌跡
霓虹線條
動態光粒子
```

## 2. 品牌特色區

標題：

```txt
不是傳統接龍，是更有系統的羽球體驗
```

卡片內容：

### 卡片 1

```txt
LINE 報名整合
不用再翻群組訊息，報名、候補、遞補通知一次完成。
```

### 卡片 2

```txt
程度分級開團
依照球友程度安排場次，讓每一場都打得剛剛好。
```

### 卡片 3

```txt
教練團專業教學
從基礎步伐、發力到實戰策略，建立真正能上場的能力。
```

### 卡片 4

```txt
未來品牌商品
球衣、毛巾、配件與限定周邊，打造屬於球團的品牌文化。
```

## 3. 教學 / 臨打服務區

可以設計成兩張大型卡片。

### 教學卡

```txt
羽球教學

適合新手、初階、中階球友。
從握拍、步伐、發球、殺球到雙打輪轉，建立完整羽球基礎。
```

按鈕：

```txt
查看教學據點
```

### 臨打卡

```txt
羽球臨打

固定開團、程度限制、候補通知。
透過 LINE 系統快速報名，不再依賴傳統文字接龍。
```

按鈕：

```txt
查看臨打場次
```

## 4. 熱門場地區

標題：

```txt
熱門開團場地
```

卡片範例：

```txt
中壢飆球俱樂部
每週三 20:00–22:00
程度：4–6 級
用球：RSL No.4
費用：$200 / 次
```

```txt
桃園羽球館
每週五 19:00–21:00
程度：初階～中階
類型：教學 / 團練
```

```txt
宜蘭合作場館
不定期開團
類型：臨打 / 交流賽
```

## 5. 教練團精選區

首頁可以先放 3 位教練。

每張教練卡包含：

```txt
教練照片
教練姓名
擅長項目
教學年資
適合學生程度
查看介紹
```

範例：

```txt
Jason 教練
擅長：雙打輪轉、前後場銜接、實戰戰術
適合：初階～中高階
```

## 6. LINE 報名系統介紹區

這個區塊可以強化網站差異化。

標題：

```txt
告別文字接龍，用 LINE 完成報名與候補通知
```

內容：

```txt
球友可透過 LINE 快速查看場次、報名臨打、查詢候補狀態。當候補球員遞補為正式名單時，系統會自動通知，降低團主人工管理成本，也讓球友不再錯過上場機會。
```

功能卡片：

```txt
場次查詢
一鍵報名
候補通知
費用狀態
會員綁定
球友紀錄
```

## 7. 活動照片 / 球友評價區

可以做成橫向輪播。

評價範例：

```txt
第一次參加就覺得流程很清楚，不用在群組裡翻接龍，候補通知也很方便。
```

```txt
程度限制蠻準的，打起來節奏舒服，不會有落差太大的問題。
```

```txt
教練講解很細，對新手很友善，練完真的知道自己問題在哪。
```

## 8. 商品預留區

這是為未來電商轉型做準備。

標題：

```txt
球團限定商品 Coming Soon
```

副標：

```txt
未來將推出球衣、毛巾、羽球配件與限定周邊，讓球友不只一起打球，也一起穿出球團精神。
```

商品卡片可以先放灰階或半透明狀態：

```txt
球團隊服
限定運動毛巾
羽球握把布
球團紀念吊牌
```

按鈕：

```txt
查看全部商品
```

目前若商品還沒上架，可以顯示：

```txt
商品籌備中
```

或：

```txt
搶先加入通知名單
```

## 9. FAQ 區

SEO 非常重要。

建議問題：

```txt
Q1：羽球臨打需要自備球拍嗎？
Q2：新手可以參加臨打嗎？
Q3：羽球教學適合完全沒基礎的人嗎？
Q4：臨打報名後可以取消嗎？
Q5：候補遞補會怎麼通知？
Q6：球團商品什麼時候開賣？
Q7：如何透過 LINE 綁定會員？
```

## 10. 最終 CTA

標題：

```txt
準備好加入下一場羽球節奏了嗎？
```

按鈕：

```txt
立即查看場次
加入 LINE 綁定會員
```

---

# 十二、教練團介紹頁

URL：

```txt
/coaches
```

## 頁面結構

```txt
Hero Banner
教練團總覽
教練篩選器
教練詳細卡片
教學方案說明
FAQ
CTA
```

## 教練卡片欄位

```txt
教練姓名
教練照片
教學地區
教學年資
擅長項目
適合程度
可預約時段
教學風格
LINE 預約按鈕
```

## 篩選功能

```txt
依地區篩選
依程度篩選
依教學類型篩選
依教練專長篩選
```

篩選項目：

```txt
新手入門
步伐訓練
單打訓練
雙打輪轉
殺球強化
防守訓練
兒童羽球
成人團課
一對一教學
```

---

# 十三、全部商品頁

URL：

```txt
/products
```

這頁一開始即使還沒有正式商品，也要保留架構。

## 商品頁架構

```txt
商品頁 Hero
商品分類篩選
商品列表
品牌故事區
購買須知
FAQ
```

## 商品分類

```txt
球團服飾
羽球配件
訓練用品
限定周邊
活動紀念商品
```

## 商品卡片欄位

```txt
商品圖片
商品名稱
商品價格
商品標籤
商品簡介
查看商品
```

範例：

```txt
森映球團限定隊服
NT$ 980
標籤：Coming Soon
```

```txt
羽森桃園運動毛巾
NT$ 390
標籤：即將開賣
```

```txt
球團限定握把布
NT$ 180
標籤：預購準備中
```

---

# 十四、會員登入、註冊與會員中心頁

## 會員登入頁 /login

### 頁面目的

讓球友登入後可以查看自己的報名、候補、教學預約與未來商品訂單。

### 欄位

```txt
Email / 手機 / LINE 登入
密碼
忘記密碼
登入按鈕
LINE 快速登入 / 綁定
```

### 視覺建議

登入頁可以延續深紫科技風，右側放羽球球場或球拍光軌背景。

## 會員註冊頁 /register

### 欄位

```txt
姓名
手機
Email
密碼
確認密碼
所在地區
羽球程度
是否同意隱私權政策與使用條款
```

### 羽球程度選項

```txt
新手
初階
初中階
中階
中高階
高階
```

## LINE 綁定頁 /line-binding

### 頁面目的

讓 LINE OA 的圖文選單可以導向此頁，讓球友完成會員與 LINE 帳號綁定。

### 頁面內容

```txt
品牌說明
綁定好處
LINE 綁定按鈕
目前綁定狀態
常見問題
```

## 會員中心 /member-dashboard

### 建議功能

```txt
個人資料
我的臨打報名
我的候補狀態
我的教學預約
我的商品訂單
LINE 綁定狀態
通知設定
```

---

# 十五、聯絡我們頁

URL：

```txt
/contact
```

## 頁面內容

```txt
聯絡表單
LINE 官方帳號
合作洽詢
教學預約
場地合作
品牌商品合作
```

## 表單欄位

```txt
姓名
手機
Email
詢問類型
所在地區
訊息內容
```

詢問類型：

```txt
臨打報名問題
羽球教學預約
場地合作
商品合作
系統合作
其他
```

---

# 十六、隱私權政策頁

URL：

```txt
/privacy-policy
```

需包含：

```txt
資料蒐集範圍
LINE 綁定資料使用方式
會員資料使用方式
報名資料保存方式
付款資料處理方式
Cookie 使用說明
第三方服務
使用者資料刪除方式
聯絡窗口
```

---

# 十七、使用條款頁

URL：

```txt
/terms
```

需包含：

```txt
網站使用規範
會員帳號規範
報名規則
取消與候補規則
付款與退款規則
教學預約規則
商品購買規則
智慧財產權
責任限制
條款修改權利
```

---

# 十八、SEO 架構設計

## 每頁基本 SEO 欄位

每個頁面都應具備：

```txt
Title
Meta Description
H1
H2 / H3 結構
OG Title
OG Description
OG Image
Canonical URL
Schema 結構化資料
```

## 首頁 SEO 範例

### Title

```txt
森映球團｜桃園羽球教學、臨打報名與 LINE 羽球系統
```

### Meta Description

```txt
森映球團提供桃園、中壢及多地羽球教學與臨打服務，整合 LINE 報名、候補通知與會員綁定系統，讓球友快速找到適合自己的羽球場次與教練。
```

### H1

```txt
桃園羽球教學與臨打報名平台
```

## 教練團頁 SEO

### Title

```txt
羽球教練團介紹｜桃園羽球教學、新手入門與進階訓練
```

### Meta Description

```txt
查看森映球團羽球教練團，提供新手入門、成人羽球教學、雙打輪轉、步伐訓練與實戰技巧課程，適合不同程度球友預約學習。
```

## 商品頁 SEO

### Title

```txt
羽球商品專區｜球團隊服、羽球配件與限定周邊
```

### Meta Description

```txt
森映球團商品專區將推出球團隊服、運動毛巾、羽球配件與限定周邊商品，打造專屬羽球品牌風格。
```

---

# 十九、建議 Schema 結構化資料

首頁：

```txt
Organization
WebSite
FAQPage
LocalBusiness
SportsActivityLocation
```

教練頁：

```txt
Person
Service
FAQPage
```

商品頁：

```txt
Product
Offer
BreadcrumbList
```

聯絡頁：

```txt
ContactPage
Organization
```

會員頁：

```txt
WebPage
BreadcrumbList
```

---

# 二十、特效設計建議

這個網站既然要「強烈、有特色」，建議不要只做普通滾動動畫，而是做成有記憶點的運動科技風。

## 可使用特效

### 1. 羽球軌跡線

滑鼠移動時，背景出現淡淡的羽球飛行弧線。

### 2. 3D 台灣地圖發光

教學與臨打 Tab 切換時，地圖光色切換。

```txt
教學：藍紫光
臨打：紅紫光
```

### 3. 場地卡片浮現

Hover 縣市時，卡片從地圖旁邊浮出。

### 4. Hero 背景粒子

像球場燈光中的灰塵粒子，營造舞台感。

### 5. Section 進場動畫

每個區塊進入視窗時，有漸層光掃過。

### 6. 球拍網線紋理

背景可加入細緻球拍網線 Pattern。

### 7. CTA 按鈕能量光暈

主要按鈕 hover 時有紫藍光暈。

### 8. 商品卡片 3D Tilt

商品卡片滑鼠移動時微微傾斜，增加電商質感。

---

# 二十一、技術架構建議

如果要做得很有質感，建議使用：

```txt
Next.js
React
Tailwind CSS
Framer Motion
Three.js / React Three Fiber
Supabase
綠界 ECPay
自製 CMS 後台
```

## 前端

```txt
Next.js：SEO 與效能佳
Tailwind CSS：快速建立紫色科技感 UI
Framer Motion：頁面動畫
Three.js：3D 台灣互動地圖
```

## 後端 / 資料庫

```txt
Supabase
```

適合管理：

```txt
縣市據點
教練資料
臨打場次
教學課程
商品資料
會員資料
LINE 綁定狀態
報名紀錄
CMS 前端設定
```

---

# 二十二、資料庫 Table 建議

## locations 據點表

```sql
create table locations (
  id uuid primary key default gen_random_uuid(),
  city varchar(50) not null,
  district varchar(50),
  name varchar(100) not null,
  address text,
  type varchar(20) not null, -- teaching / dropin / both
  description text,
  latitude numeric,
  longitude numeric,
  is_active boolean default true,
  created_at timestamp default now()
);
```

## coaches 教練表

```sql
create table coaches (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  avatar_url text,
  title varchar(100),
  city varchar(50),
  experience_years int,
  specialties text[],
  level_tags text[],
  description text,
  is_active boolean default true,
  created_at timestamp default now()
);
```

## sessions 臨打場次表

```sql
create table sessions (
  id uuid primary key default gen_random_uuid(),
  location_id uuid references locations(id),
  title varchar(100) not null,
  session_type varchar(30) not null, -- dropin / teaching / training
  weekday varchar(20),
  start_time time,
  end_time time,
  level_min int,
  level_max int,
  shuttlecock varchar(100),
  price numeric,
  capacity int,
  is_active boolean default true,
  created_at timestamp default now()
);
```

## products 商品表

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  name varchar(150) not null,
  slug varchar(150) unique not null,
  description text,
  price numeric,
  compare_at_price numeric,
  image_url text,
  category varchar(100),
  status varchar(30) default 'coming_soon', -- draft / active / coming_soon / sold_out
  stock_quantity int default 0,
  is_active boolean default false,
  created_at timestamp default now()
);
```

## members 會員表

```sql
create table members (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  name varchar(100),
  phone varchar(30),
  email varchar(150),
  line_user_id varchar(150),
  city varchar(50),
  badminton_level varchar(50),
  is_line_bound boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

## cms_pages CMS 頁面表

```sql
create table cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug varchar(150) unique not null,
  title varchar(150) not null,
  page_type varchar(50),
  content jsonb,
  seo_title varchar(255),
  seo_description text,
  og_image_url text,
  is_published boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

## site_settings 網站設定表

```sql
create table site_settings (
  id uuid primary key default gen_random_uuid(),
  key varchar(100) unique not null,
  value jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

可放：

```txt
首頁標語
LINE 連結
Hero 顯示城市
商品開賣狀態
CTA 文字
SEO 設定
網站顏色
Footer 內容
```

---

# 二十三、3D 台灣地圖資料格式

建議後台可以用這種結構控制縣市狀態：

```json
{
  "teaching": [
    {
      "city": "桃園市",
      "active": true,
      "color": "blue-purple",
      "locations": [
        {
          "name": "羽森桃園教學據點",
          "district": "中壢區",
          "type": "成人羽球教學",
          "description": "適合新手與初階球友",
          "buttonText": "查看教學課程"
        }
      ]
    }
  ],
  "dropin": [
    {
      "city": "桃園市",
      "active": true,
      "color": "red-purple",
      "locations": [
        {
          "name": "中壢飆球俱樂部",
          "district": "中壢區",
          "time": "每週三 20:00–22:00",
          "level": "4–6級",
          "price": "$200 / 次",
          "buttonText": "查看臨打場次"
        }
      ]
    }
  ]
}
```

---

# 二十四、首頁 Wireframe 文字版

```txt
[Header]
Logo｜首頁｜教學據點｜臨打場次｜教練團｜商品專區｜聯絡我們｜會員登入｜立即報名

[Hero]
左：品牌標語、說明、CTA
右：3D 台灣地圖
上方 Tab：教學 / 臨打
Hover 發光縣市 → 場地卡片

[品牌特色]
LINE 報名整合｜程度分級開團｜專業教練團｜未來商品品牌

[教學 / 臨打服務]
大型雙卡片切換

[熱門場地]
場地卡片列表

[教練團]
3–4 位教練卡片

[LINE 系統特色]
報名、候補、遞補、會員綁定

[球友評價]
橫向輪播

[商品預留區]
Coming Soon 商品卡

[FAQ]
常見問題

[CTA]
加入 LINE / 查看場次

[Footer]
Logo｜網站選單｜LINE｜社群｜政策頁
```

---

# 二十五、Footer 設計

Footer 建議分四欄。

## 第一欄：品牌

```txt
森映球團｜羽森桃園
讓羽球成為一種更有系統、更有溫度的運動生活。
```

## 第二欄：網站導覽

```txt
首頁
教練團介紹
全部商品
會員中心
聯絡我們
```

## 第三欄：服務項目

```txt
羽球教學
羽球臨打
LINE 報名系統
球團商品
```

## 第四欄：政策

```txt
隱私權政策
使用條款
取消與退款規則
```

---

# 二十六、RWD 手機版設計

手機版要特別注意 3D 台灣地圖不要太重。

## 手機版 Hero 建議

桌機：

```txt
左文案 + 右 3D 台灣地圖
```

手機：

```txt
上方文案
下方簡化版互動台灣地圖
再下方顯示據點卡片列表
```

手機版可以改成：

```txt
Tab：教學 / 臨打
縣市 chips：桃園市、新北市、宜蘭縣
點擊縣市後展開卡片
```

這樣體驗會比硬塞 3D 地圖更好。

---

# 二十七、設計重點總結

這個網站最有記憶點的地方應該是：

```txt
3D 台灣互動地圖
```

它可以同時承載：

1. 品牌視覺。
2. 教學據點。
3. 臨打據點。
4. 未來全台擴展感。
5. 使用者互動體驗。
6. SEO 頁面內部連結入口。
7. CMS 後台可控的縣市資料。

整體網站要走：

```txt
深紫科技感背景
藍色代表教學
紅色代表臨打
白色維持資訊清楚
霓虹光與羽球軌跡製造速度感
```

---

# 二十八、首頁主視覺文案建議

可以直接用這版：

```txt
森映球團｜羽森桃園

讓每一次上場，都更有系統、更有節奏

從羽球教學、臨打開團到 LINE 報名通知，森映球團整合球友最需要的參與流程，讓你不用再翻群組接龍，也能快速找到適合自己的教練、場地與下一場比賽。
```

CTA：

```txt
查看臨打場次
預約羽球教學
```

---

# 二十九、品牌標語建議

可選一組作為網站主標語：

```txt
讓羽球，不只是一場運動，而是一種生活節奏。
```

```txt
用系統管理球局，用熱情連結球友。
```

```txt
從教學到臨打，找到最適合你的羽球節奏。
```

```txt
下一場球，不用接龍，用 LINE 就能完成。
```

```txt
森映球團，讓每一次上場都更有秩序。
```

最推薦：

```txt
從教學到臨打，找到最適合你的羽球節奏。
```

原因是它同時涵蓋「教學」、「臨打」、「球團服務」，也適合放在首頁 Hero。

---

# 三十、建議開發階段

## Phase 1：品牌形象網站 MVP

```txt
首頁
3D / SVG 台灣互動地圖第一版
教練團介紹
全部商品 Coming Soon
聯絡我們
隱私權政策
使用條款
基本 SEO
CMS 後台第一版
```

## Phase 2：會員與 LINE 綁定

```txt
登入 / 註冊
會員中心
LINE 綁定
我的臨打報名
我的候補狀態
我的教學預約
```

## Phase 3：臨打與教學管理

```txt
臨打場次管理
教學課程管理
候補通知
報名狀態
付款狀態
```

## Phase 4：電商擴充

```txt
商品上架
商品分類
購物車
結帳
綠界金流
訂單管理
優惠券
會員購買紀錄
```

---

# 三十一、總結建議

此站不建議只做成一般形象網站，因為你的需求已經具備平台型網站的特徵。

最適合的架構是：

```txt
品牌形象官網 + CMS 後台 + 會員中心 + LINE 綁定 + 未來電商
```

技術建議：

```txt
Next.js + Supabase + 自製 CMS 後台 + Three.js / React Three Fiber
```

第一版就應該把會員登入、註冊、會員中心與 CMS 後台一起納入設計，只是功能可以分階段上線。這樣未來要擴充臨打報名、候補通知、商品販售、訂單管理與 LINE 綁定時，不需要重做整個網站架構。
