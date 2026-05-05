import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";
import type { CurrentUserBundle } from "@/types/auth";
import { isAdminRole } from "@/lib/auth/roles";

export async function requireAdminUser(): Promise<CurrentUserBundle> {
  const bundle = await getCurrentUser();

  if (!bundle.user) {
    redirect("/login?redirect=/admin");
  }

  const role = bundle.profile?.role ?? null;
  if (!role || !isAdminRole(role)) {
    redirect("/member-dashboard");
  }

  return bundle;
}

