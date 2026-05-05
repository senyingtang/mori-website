"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * 瀏覽器端 Supabase（沿用 anon key + RLS）。
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return createBrowserClient(url, anon);
}
