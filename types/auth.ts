import type { User } from "@supabase/supabase-js";

/** profiles 表（與 auth.users 1:1） */
export type ProfileRow = {
  id: string;
  role: string;
  display_name: string | null;
  created_at: string | null;
  updated_at: string | null;
};

/** members 表 */
export type MemberRow = {
  id: string;
  auth_user_id: string;
  name: string;
  phone: string | null;
  email: string;
  city: string | null;
  badminton_level: string | null;
  is_line_bound: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type CurrentUserBundle = {
  user: User | null;
  profile: ProfileRow | null;
  member: MemberRow | null;
};
