/** CMS / Supabase 前台用型別（jsonb 以寬鬆型別處理） */

export type ServiceTypeDb = "teaching" | "dropin" | "both";

export type SessionTypeDb = "dropin" | "teaching" | "training";

export type ProductStatusDb =
  | "draft"
  | "coming_soon"
  | "active"
  | "sold_out";

export type MapTabType = "teaching" | "dropin";

export type MapCitySetting = {
  id: string;
  tab_type: MapTabType;
  city: string;
  is_enabled: boolean;
  glow_color: string;
  hover_title: string;
  hover_description: string | null;
  cta_text: string;
  cta_href: string;
  location_ids: string[];
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
};

export type Location = {
  id: string;
  city: string;
  district: string | null;
  name: string;
  address: string | null;
  service_type: ServiceTypeDb;
  description: string | null;
  latitude: string | null;
  longitude: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type Session = {
  id: string;
  location_id: string;
  title: string | null;
  session_type: SessionTypeDb;
  weekday: string | null;
  start_time: string | null;
  end_time: string | null;
  level_min: number | null;
  level_max: number | null;
  shuttlecock: string | null;
  price: string | null;
  capacity: number | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type SessionWithLocation = Session & {
  location: Location | null;
};

export type Coach = {
  id: string;
  auth_user_id: string | null;
  name: string;
  avatar_url: string | null;
  city: string | null;
  experience_years: number | null;
  specialties: string[] | null;
  level_tags: string[] | null;
  teaching_styles: string[] | null;
  description: string | null;
  line_contact_url: string | null;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string | null;
  compare_at_price: string | null;
  image_url: string | null;
  category_id: string | null;
  status: ProductStatusDb;
  stock_quantity: number;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
};

export type ProductWithCategory = Product & {
  category: ProductCategory | null;
};

export type Faq = {
  id: string;
  page_key: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type ContactSubmission = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  line_id: string | null;
  inquiry_type: string;
  subject: string | null;
  message: string;
  source_path: string | null;
  source_type: string | null;
  source_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: "new" | "contacted" | "closed" | "spam";
  admin_note: string | null;
  created_at: string | null;
  updated_at: string | null;
};

/** home_sections.content JSON */
export type HomeSectionContent = Record<string, unknown>;
