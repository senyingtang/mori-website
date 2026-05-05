-- demo_seed.sql
-- 示範／開發用資料：可重跑、不建立 auth.users、不寫入 service key。
-- 建議僅在空資料庫、Staging 或「同意覆寫示範資料」的環境執行。
--
-- 行為摘要：
-- * site_settings / home_sections / seo_settings / product_categories / products / policy_pages / map_city_settings：ON CONFLICT 覆寫或更新
-- * locations：先刪除固定名稱之據點（及依賴之 sessions），再以固定 UUID 重建
-- * faqs：會刪除 page_key 為 home / coaches / products / locations / sessions 之「全部」FAQ 後重插（若正式站已自訂 FAQ，請勿在該庫執行此段；可改為僅手動匯入）
-- * coaches：依示範姓名刪除後重插（固定 UUID）

BEGIN;

-- ---------------------------------------------------------------------------
-- site_settings（brand / links / contact / theme）
-- ---------------------------------------------------------------------------
INSERT INTO public.site_settings (key, value, is_public)
VALUES
  (
    'brand',
    jsonb_build_object(
      'site_name', '森映球團｜羽森桃園',
      'tagline', '從教學到臨打，找到最適合你的羽球節奏',
      'slogan', '從教學到臨打，找到最適合你的羽球節奏',
      'logo_url', ''
    ),
    true
  ),
  (
    'links',
    jsonb_build_object(
      'line_official', '#',
      'facebook', '#',
      'instagram', '#'
    ),
    true
  ),
  (
    'contact',
    jsonb_build_object(
      'email', 'hello@example.com',
      'support_email', 'hello@example.com'
    ),
    true
  ),
  (
    'theme',
    jsonb_build_object(
      'primary_purple', '#6D28D9',
      'deep_purple', '#1E103D',
      'neon_purple', '#A855F7',
      'electric_blue', '#2563EB',
      'energy_red', '#EF4444'
    ),
    true
  )
ON CONFLICT (key) DO UPDATE
SET value = excluded.value,
    is_public = excluded.is_public,
    updated_at = now();

-- ---------------------------------------------------------------------------
-- seo_settings（page_key 齊全；Auth 相關頁 noindex）
-- ---------------------------------------------------------------------------
INSERT INTO public.seo_settings (
  page_key, title, meta_description, h1,
  og_title, og_description, og_image_url, canonical_url,
  noindex
)
VALUES
  (
    'home',
    '森映球團｜羽森桃園｜桃園羽球教學、臨打與品牌探索',
    '森映球團｜羽森桃園：從成人羽球教學、臨打開團到品牌周邊，整合 LINE 通知與會員服務（報名／付款尚未上線前亦可先洽詢）。',
    '森映球團｜羽森桃園',
    '森映球團｜羽森桃園',
    '從教學到臨打，找到最適合你的羽球節奏。',
    null,
    null,
    false
  ),
  (
    'locations',
    '據點總覽｜森映球團｜羽森桃園',
    '查看森映球團在北北基桃與宜蘭等地的合作場地：教學、臨打與訓練據點整理。',
    '據點總覽',
    '據點總覽｜森映球團',
    '羽球教學與臨打合作場地列表。',
    null,
    null,
    false
  ),
  (
    'sessions',
    '場次列表｜臨打・教學・訓練｜森映球團',
    '依星期、地區與類型瀏覽森映球團開放的羽球臨打、教學與訓練場次（實際報名規則依公告／聯絡為準）。',
    '場次列表',
    '場次列表｜森映球團',
    '臨打、教學與訓練場次資訊。',
    null,
    null,
    false
  ),
  (
    'coaches',
    '教練團｜森映球團｜羽森桃園',
    '認識森映球團教練：專長、適合程度與教學風格，找到最適合你的羽球節奏。',
    '教練團',
    '教練團｜森映球團',
    '羽球教練專長與風格介紹。',
    null,
    null,
    false
  ),
  (
    'products',
    '商品｜森映球團｜隊服・配件・周邊',
    '森映球團品牌商品：隊服、配件與限定周邊（購物車／結帳尚未開放，可先留通知）。',
    '商品專區',
    '商品｜森映球團',
    '球團周邊與配件預告。',
    null,
    null,
    false
  ),
  (
    'contact',
    '聯絡我們｜森映球團｜羽森桃園',
    '臨打、教學、場地／品牌合作或商品通知，歡迎留下需求；訊息將寫入後台（不自動寄信）。',
    '聯絡我們',
    '聯絡我們｜森映球團',
    '表單洽詢與合作窗口。',
    null,
    null,
    false
  ),
  (
    'privacy_policy',
    '隱私權政策｜森映球團',
    '說明本網站如何蒐集、使用與保護您的個人資料與 Cookie。',
    '隱私權政策',
    '隱私權政策｜森映球團',
    '個人資料與 Cookie 說明。',
    null,
    null,
    false
  ),
  (
    'terms',
    '使用條款｜森映球團',
    '網站使用、會員行為與未來服務條款之基本約定。',
    '使用條款',
    '使用條款｜森映球團',
    '服務與網站使用規範。',
    null,
    null,
    false
  ),
  (
    'login',
    '會員登入｜森映球團',
    '登入會員以使用會員中心與後續綁定／報名功能（部分功能尚未開放）。',
    '會員登入',
    '會員登入｜森映球團',
    '會員登入頁面。',
    null,
    null,
    true
  ),
  (
    'register',
    '會員註冊｜森映球團',
    '建立會員帳號以接收後續通知與服務（LINE OAuth 尚未串接）。',
    '會員註冊',
    '會員註冊｜森映球團',
    '建立新帳號。',
    null,
    null,
    true
  ),
  (
    'member_dashboard',
    '會員中心｜森映球團',
    '檢視會員基本資訊與後續將開放之報名／訂單紀錄。',
    '會員中心',
    '會員中心｜森映球團',
    '會員專區。',
    null,
    null,
    true
  ),
  (
    'line_binding',
    'LINE 綁定｜森映球團',
    '綁定 LINE 以便接收通知（OAuth 串接前為版面預留）。',
    'LINE 綁定',
    'LINE 綁定｜森映球團',
    '會員與 LINE 綁定說明。',
    null,
    null,
    true
  )
ON CONFLICT (page_key) DO UPDATE
SET title = excluded.title,
    meta_description = excluded.meta_description,
    h1 = excluded.h1,
    og_title = excluded.og_title,
    og_description = excluded.og_description,
    og_image_url = COALESCE(excluded.og_image_url, seo_settings.og_image_url),
    canonical_url = COALESCE(excluded.canonical_url, seo_settings.canonical_url),
    noindex = excluded.noindex,
    updated_at = now();

-- ---------------------------------------------------------------------------
-- home_sections（非空 content）
-- ---------------------------------------------------------------------------
INSERT INTO public.home_sections (section_key, is_enabled, sort_order, content)
VALUES
  (
    'hero',
    true,
    10,
    jsonb_build_object(
      'badge', '森映球團｜羽森桃園',
      'title', '從教學到臨打，找到最適合你的羽球節奏',
      'subtitle',
      '北北基桃與宜蘭多地開團／教學，搭配網站與未來 LINE 通知，讓你更快找到下一場適合的羽球節奏。'
    )
  ),
  (
    'features',
    true,
    20,
    jsonb_build_object(
      'items',
      jsonb_build_array(
        jsonb_build_object(
          'emoji', '📱',
          'title', 'LINE 整合預留',
          'description', '朝報名、候補與通知一站式整理（OAuth 尚未串接，版面已預留）。'
        ),
        jsonb_build_object(
          'emoji', '🎯',
          'title', '程度分級場次',
          'description', '臨打／教學／訓練場次標示程度區間，方便選擇適合場次。'
        ),
        jsonb_build_object(
          'emoji', '🏸',
          'title', '教練團合作',
          'description', '羽球教學與實戰訓練，協助你穩定進步。'
        ),
        jsonb_build_object(
          'emoji', '✨',
          'title', '品牌商品預告',
          'description', '隊服、毛巾與周邊逐步釋出，可先留通知。'
        )
      )
    )
  ),
  (
    'service_intro',
    true,
    30,
    jsonb_build_object(
      'teaching',
      jsonb_build_object(
        'title', '羽球教學',
        'description', '新手入門到進階策略，依程度安排課程節奏。',
        'cta', '查看教學據點'
      ),
      'dropin',
      jsonb_build_object(
        'title', '臨打開團',
        'description', '固定開團與交流賽，找到志同道合的球友。',
        'cta', '查看臨打場次'
      )
    )
  ),
  ('popular_venues', true, 40, jsonb_build_object('title', '熱門據點與場次', 'subtitle', '從桃園、雙北到宜蘭，探索我們的合作場館。')),
  ('featured_coaches', true, 50, jsonb_build_object('title', '精選教練', 'subtitle', '依地區與專長快速認識教練團。')),
  (
    'line_intro',
    true,
    60,
    jsonb_build_object(
      'title', 'LINE 會員與通知（預留）',
      'body', '完成綁定後可接收開團／候補相關通知；OAuth 串接完成前請先使用聯絡表單與我們聯繫。'
    )
  ),
  ('testimonials', true, 70, jsonb_build_object('title', '球友怎麼說', 'subtitle', '示範評價輪播（可於後台擴充資料來源）。')),
  ('coming_soon_products', true, 80, jsonb_build_object('title', '即將開賣', 'subtitle', '隊服、配件與紀念小物，敬請期待。')),
  ('faqs', true, 90, jsonb_build_object('title', '常見問題', 'subtitle', '首次參與臨打或教學前可先看這裡。')),
  ('final_cta', true, 100, jsonb_build_object('title', '準備好加入下一場羽球節奏了嗎？'))
ON CONFLICT (section_key) DO UPDATE
SET is_enabled = excluded.is_enabled,
    sort_order = excluded.sort_order,
    content = excluded.content,
    updated_at = now();

-- ---------------------------------------------------------------------------
-- product_categories
-- ---------------------------------------------------------------------------
INSERT INTO public.product_categories (name, slug, description, sort_order, is_active)
VALUES
  ('球團服飾', 'team-apparel', '球衣與球團識別款', 10, true),
  ('羽球配件', 'badminton-accessories', '握把布、小物與周邊配件', 20, true),
  ('訓練用品', 'training-gear', '訓練輔助與紀錄小物', 30, true),
  ('限定周邊', 'limited-merch', '期間限定與收藏款', 40, true),
  ('活動紀念商品', 'event-souvenirs', '品牌活動紀念', 50, true)
ON CONFLICT (slug) DO UPDATE
SET name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now();

-- ---------------------------------------------------------------------------
-- locations：移除同名據點與其場次後，以固定 UUID 重建（可重跑）
-- ---------------------------------------------------------------------------
DELETE FROM public.sessions
WHERE location_id IN (
  SELECT id
  FROM public.locations
  WHERE name IN (
    '中壢飆球俱樂部',
    '羽森桃園教學據點',
    '宜蘭合作場館',
    '新北合作羽球館',
    '台北週末訓練中心'
  )
);

DELETE FROM public.locations
WHERE name IN (
  '中壢飆球俱樂部',
  '羽森桃園教學據點',
  '宜蘭合作場館',
  '新北合作羽球館',
  '台北週末訓練中心'
);

INSERT INTO public.locations (
  id, city, district, name, address, service_type, description, is_active
)
VALUES
  (
    'b1000001-0000-4000-a000-000000000001'::uuid,
    '桃園市',
    '中壢區',
    '中壢飆球俱樂部',
    null,
    'dropin'::public.service_type,
    '固定開團臨打據點（示範資料）。',
    true
  ),
  (
    'b1000002-0000-4000-a000-000000000002'::uuid,
    '桃園市',
    '桃園區',
    '羽森桃園教學據點',
    null,
    'teaching'::public.service_type,
    '成人羽球教學據點（示範資料）。',
    true
  ),
  (
    'b1000003-0000-4000-a000-000000000003'::uuid,
    '宜蘭縣',
    '羅東鎮',
    '宜蘭合作場館',
    null,
    'both'::public.service_type,
    '教學／臨打／交流（依公告）（示範資料）。',
    true
  ),
  (
    'b1000004-0000-4000-a000-000000000004'::uuid,
    '新北市',
    '板橋區',
    '新北合作羽球館',
    null,
    'both'::public.service_type,
    '雙北合作場館（示範資料）。',
    true
  ),
  (
    'b1000005-0000-4000-a000-000000000005'::uuid,
    '台北市',
    '大安區',
    '台北週末訓練中心',
    null,
    'teaching'::public.service_type,
    '週末訓練與進階課程（示範資料）。',
    true
  );

-- ---------------------------------------------------------------------------
-- sessions（對應五據點；其中四筆依規格）
-- ---------------------------------------------------------------------------
INSERT INTO public.sessions (
  location_id,
  title,
  session_type,
  weekday,
  start_time,
  end_time,
  level_min,
  level_max,
  shuttlecock,
  price,
  capacity,
  is_active
)
VALUES
  (
    'b1000001-0000-4000-a000-000000000001'::uuid,
    '中壢飆球俱樂部｜臨打',
    'dropin'::public.session_type,
    '每週三',
    '20:00'::time,
    '22:00'::time,
    4,
    6,
    'RSL No.4',
    200,
    18,
    true
  ),
  (
    'b1000002-0000-4000-a000-000000000002'::uuid,
    '羽森桃園｜週六教學',
    'teaching'::public.session_type,
    '每週六',
    '10:00'::time,
    '12:00'::time,
    null,
    null,
    null,
    null,
    8,
    true
  ),
  (
    'b1000003-0000-4000-a000-000000000003'::uuid,
    '宜蘭合作場館｜臨打',
    'dropin'::public.session_type,
    '每週日',
    '15:00'::time,
    '17:00'::time,
    3,
    5,
    'RSL No.4',
    180,
    16,
    true
  ),
  (
    'b1000004-0000-4000-a000-000000000004'::uuid,
    '新北合作羽球館｜訓練',
    'training'::public.session_type,
    '每週五',
    '19:30'::time,
    '21:30'::time,
    4,
    7,
    null,
    250,
    12,
    true
  );

-- 台北據點：示範教學場次（補齊第五據點可見資料）
INSERT INTO public.sessions (
  location_id,
  title,
  session_type,
  weekday,
  start_time,
  end_time,
  level_min,
  level_max,
  shuttlecock,
  price,
  capacity,
  is_active
)
VALUES
  (
    'b1000005-0000-4000-a000-000000000005'::uuid,
    '台北週末訓練中心｜進階教學',
    'teaching'::public.session_type,
    '每週日',
    '14:00'::time,
    '16:00'::time,
    5,
    8,
    null,
    320,
    10,
    true
  );

-- ---------------------------------------------------------------------------
-- map_city_settings（tab_type + city 唯一；location_ids 對應據點）
-- ---------------------------------------------------------------------------
INSERT INTO public.map_city_settings (
  tab_type,
  city,
  is_enabled,
  glow_color,
  hover_title,
  hover_description,
  cta_text,
  cta_href,
  location_ids,
  sort_order
)
VALUES
  (
    'teaching'::public.map_tab_type,
    '桃園市',
    true,
    '#2563EB',
    '桃園市｜羽森桃園教學據點',
    '成人羽球教學／入門到進階。',
    '查看教學場次',
    '/sessions?type=teaching',
    ARRAY['b1000002-0000-4000-a000-000000000002'::uuid],
    10
  ),
  (
    'teaching'::public.map_tab_type,
    '宜蘭縣',
    true,
    '#2563EB',
    '宜蘭縣｜宜蘭合作場館',
    '教學與交流賽（依公告）。',
    '查看教學場次',
    '/sessions?type=teaching',
    ARRAY['b1000003-0000-4000-a000-000000000003'::uuid],
    20
  ),
  (
    'teaching'::public.map_tab_type,
    '新北市',
    true,
    '#2563EB',
    '新北市｜合作羽球館',
    '訓練與進階課程。',
    '查看場次',
    '/sessions',
    ARRAY['b1000004-0000-4000-a000-000000000004'::uuid],
    30
  ),
  (
    'teaching'::public.map_tab_type,
    '台北市',
    true,
    '#2563EB',
    '台北市｜週末訓練中心',
    '週末班與技術強化。',
    '查看教學場次',
    '/sessions?type=teaching',
    ARRAY['b1000005-0000-4000-a000-000000000005'::uuid],
    40
  ),
  (
    'dropin'::public.map_tab_type,
    '桃園市',
    true,
    '#EF4444',
    '桃園市｜臨打開團',
    '中壢固定開團：每週三晚間。',
    '查看臨打場次',
    '/sessions?type=dropin',
    ARRAY['b1000001-0000-4000-a000-000000000001'::uuid],
    10
  ),
  (
    'dropin'::public.map_tab_type,
    '宜蘭縣',
    true,
    '#EF4444',
    '宜蘭縣｜臨打／交流',
    '週日下午時段（依公告）。',
    '查看臨打場次',
    '/sessions?type=dropin',
    ARRAY['b1000003-0000-4000-a000-000000000003'::uuid],
    20
  ),
  (
    'dropin'::public.map_tab_type,
    '新北市',
    true,
    '#EF4444',
    '新北市｜臨打／訓練前暖身',
    '週五晚間訓練與銜接場次。',
    '查看場次',
    '/sessions',
    ARRAY['b1000004-0000-4000-a000-000000000004'::uuid],
    30
  )
ON CONFLICT (tab_type, city) DO UPDATE
SET is_enabled = excluded.is_enabled,
    glow_color = excluded.glow_color,
    hover_title = excluded.hover_title,
    hover_description = excluded.hover_description,
    cta_text = excluded.cta_text,
    cta_href = excluded.cta_href,
    location_ids = excluded.location_ids,
    sort_order = excluded.sort_order,
    updated_at = now();

-- ---------------------------------------------------------------------------
-- coaches（固定 UUID；先刪同名再插入）
-- ---------------------------------------------------------------------------
-- 注意：此段包含欄位 `is_main_featured`，需先套用 migration 005（005_coach_main_featured.sql）後再執行。
DELETE FROM public.coaches
WHERE name IN ('Jason 教練', 'Allen 教練', 'Mina 教練', 'Yilan Coach');

INSERT INTO public.coaches (
  id,
  auth_user_id,
  name,
  avatar_url,
  city,
  experience_years,
  specialties,
  level_tags,
  teaching_styles,
  description,
  line_contact_url,
  is_featured,
  is_main_featured,
  sort_order,
  is_active
)
VALUES
  (
    'c1000001-0000-4000-a000-000000000011'::uuid,
    null,
    'Jason 教練',
    null,
    '桃園市',
    8,
    ARRAY['雙打輪轉', '前後場銜接', '實戰戰術']::text[],
    ARRAY['初階', '中階', '中高階']::text[],
    ARRAY['系統化訓練', '小組對抗']::text[],
    '擅長雙打輪轉與前後場銜接，協助你打出有效進攻節奏。',
    null,
    true,
    true,
    10,
    true
  ),
  (
    'c1000002-0000-4000-a000-000000000012'::uuid,
    null,
    'Allen 教練',
    null,
    '新北市',
    6,
    ARRAY['步伐訓練', '殺球強化', '防守反拍']::text[],
    ARRAY['新手', '初階', '中階']::text[],
    ARRAY['個別動作拆解', '多球訓練']::text[],
    '從步伐與發力打底，循序強化進攻與防守。',
    null,
    true,
    false,
    20,
    true
  ),
  (
    'c1000003-0000-4000-a000-000000000013'::uuid,
    null,
    'Mina 教練',
    null,
    '台北市',
    5,
    ARRAY['新手入門', '發球接發', '女子雙打']::text[],
    ARRAY['新手', '初階']::text[],
    ARRAY['循序引導', '場上溝通']::text[],
    '適合剛起步與想打好雙打的球友，注重基本功與場上默契。',
    null,
    true,
    false,
    30,
    true
  ),
  (
    'c1000004-0000-4000-a000-000000000014'::uuid,
    null,
    'Yilan Coach',
    null,
    '宜蘭縣',
    4,
    ARRAY['臨打前訓練', '基礎穩定性']::text[],
    ARRAY['初階', '中階']::text[],
    ARRAY['穩定輸出', '節奏控制']::text[],
    '協助你在臨打前建立穩定手感與站位選擇。',
    null,
    false,
    false,
    40,
    true
  );

-- ---------------------------------------------------------------------------
-- products（slug upsert；category 以 slug 對應）
-- ---------------------------------------------------------------------------
INSERT INTO public.products (
  name,
  slug,
  description,
  price,
  compare_at_price,
  image_url,
  category_id,
  status,
  stock_quantity,
  is_active,
  sort_order
)
SELECT
  v.name,
  v.slug,
  v.description,
  v.price,
  null::numeric,
  null::text,
  pc.id,
  v.status::public.product_status,
  0,
  v.is_active,
  v.sort_order
FROM (
  VALUES
    ('森映球團限定隊服', 'mori-team-jersey', '球團限定隊服（示範）。', 980::numeric, 'team-apparel', 'coming_soon', false, 10),
    ('羽森桃園運動毛巾', 'mori-sports-towel', '吸水運動毛巾（示範）。', 390::numeric, 'badminton-accessories', 'coming_soon', false, 20),
    ('球團限定握把布', 'mori-grip-tape', '止滑握把布（示範）。', 180::numeric, 'badminton-accessories', 'coming_soon', false, 30),
    ('羽球訓練筆記本', 'mori-training-notebook', '訓練紀錄與自我檢核（示範）。', 250::numeric, 'training-gear', 'active', true, 40),
    ('球團紀念吊牌', 'mori-memorial-tag', '紀念金屬吊牌（示範）。', null::numeric, 'limited-merch', 'coming_soon', false, 50)
) AS v(name, slug, description, price, category_slug, status, is_active, sort_order)
JOIN public.product_categories pc ON pc.slug = v.category_slug
ON CONFLICT (slug) DO UPDATE
SET name = excluded.name,
    description = excluded.description,
    price = excluded.price,
    category_id = excluded.category_id,
    status = excluded.status,
    is_active = excluded.is_active,
    sort_order = excluded.sort_order,
    updated_at = now();

-- ---------------------------------------------------------------------------
-- faqs：刪除後重建（見檔案開頭警告）
-- ---------------------------------------------------------------------------
DELETE FROM public.faqs
WHERE page_key IN ('home', 'coaches', 'products', 'locations', 'sessions');

INSERT INTO public.faqs (page_key, question, answer, sort_order, is_active)
VALUES
  ('home', '我可以怎麼找到適合的臨打場次？', '可先從首頁地圖或「場次」頁依縣市、星期篩選；若不清楚程度是否適合，歡迎使用聯絡表單詢問。', 10, true),
  ('home', '新手也可以參加嗎？', '可以。建議先確認場次的程度區間；首次參與也可先填表留下程度與需求，我們會協助建議。', 20, true),
  ('home', '教學與臨打差在哪裡？', '教學以固定課程累積技術；臨打則以實戰對抗為主，適合想維持手感與交流的同好。', 30, true),
  ('home', '為什麼還不能線上報名？', '線上報名與付款尚在規劃；目前可先透過聯絡表單洽詢或留下通知。', 40, true),
  ('home', '商品什麼時候開賣？', '部分商品為預告／預購狀態；上架時會於網站與後續通知露出。', 50, true),

  ('coaches', '我要如何選擇適合的教練？', '可依地區、專長標籤與程度篩選；若仍猶豫，歡迎留下需求由我們協助媒合。', 10, true),
  ('coaches', '教練課可以單堂試上嗎？', '依教練與場次規劃而定，請透過聯絡表單註明「教學」與方便時段。', 20, true),
  ('coaches', '沒有 LINE 也能諮詢嗎？', '可以，請使用聯絡表單並留下 Email 或手機，我們會再與你聯繫。', 30, true),

  ('products', '為什麼顯示 Coming Soon？', '商品資料為預告用途；正式上架與金流尚未開啟前，可先填「商品通知」。', 10, true),
  ('products', '可以預購或保留嗎？', '購物車與預購機制尚未開放；有任何需求請先透過聯絡表單留言。', 20, true),
  ('products', '是否有尺寸表或試穿？', '隊服類商品上架時將補齊尺寸／試穿資訊；亦可先留言詢問。', 30, true),

  ('locations', '據點地址為什麼有些是示意？', '示範環境可能尚未填入完整地址；正式營運前會於後台更新，或以場次公告為準。', 10, true),
  ('locations', '同一縣市會有多個場館嗎？', '會。可依據點卡片查看服務類型（教學／臨打／兩者）。', 20, true),
  ('locations', '如何確認場地設備與停車？', '建議於聯絡表單註明場館名稱與需求，我們將提供最新資訊。', 30, true),

  ('sessions', '場次費用會在哪裡標示？', '場次卡片會顯示價格區間或金額（若有）；仍以現場／公告為準。', 10, true),
  ('sessions', '程度 4–6 級是什麼意思？', '為示範區間標示；實際分級可依教練／場次說明，不清楚可先詢問。', 20, true),
  ('sessions', '若無法出席該怎麼辦？', '正式報名規則尚未上線；請先透過聯絡表單洽詢該場次窗口。', 30, true);

-- ---------------------------------------------------------------------------
-- policy_pages
-- ---------------------------------------------------------------------------
INSERT INTO public.policy_pages (page_key, title, content)
VALUES
  (
    'privacy_policy',
    '隱私權政策',
    $policy_privacy$
【1】資料蒐集目的
當你使用本網站註冊會員、填寫聯絡表單或瀏覽內容時，我們可能蒐集必要的識別與聯絡資訊，以提供服務、回覆諮詢與改善網站體驗。

【2】資料類型
可能包含姓名、電子郵件、電話、LINE 識別（未來若啟用綁定）、裝置與瀏覽資料（例如 Cookie）、以及你主動提供的訊息內容。

【3】Cookie
本網站可能使用 Cookie 或類似技術以維持登入狀態與流量分析；你可於瀏覽器設定中調整 Cookie，但部分功能可能受影響。

【4】資料保存與安全
我們於合理範圍內採取技術與管理措施保護資料；資料保存期間視法令與業務需求而定。

【5】你的權利
依適用法令，你可能享有查詢、更正、刪除或限制處理等權利；請透過網站聯絡方式提出申請。
    $policy_privacy$
  ),
  (
    'terms',
    '使用條款',
    $policy_terms$
【1】同意條款
使用本網站即表示你閱讀並同意本條款；若不同意請停止使用。

【2】服務內容
本網站提供品牌資訊、場次／據點／教練／商品之展示與聯絡渠道。報名、付款、購物車等功能可能尚未完整上線，以站內公告為準。

【3】會員帳號
你應妥善保管帳號憑證，並對帳號下之行為負責；若發現未經授權使用，請立即通知我們。

【4】免責與限制
在法令允許範圍內，對於因使用或無法使用本網站所生的間接或附帶損害，我們得不負賠償責任。

【5】條款修訂
我們得視需要修訂本條款；重大變更將以網站公告方式提示；修訂後之使用視為同意新版本。
    $policy_terms$
  )
ON CONFLICT (page_key) DO UPDATE
SET title = excluded.title,
    content = excluded.content,
    updated_at = now();

COMMIT;
