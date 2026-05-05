/** 與 Supabase jsonb 相容的遞迴 JSON 型別 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
