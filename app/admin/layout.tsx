import { AdminLayout } from "@/components/admin/AdminLayout";
import { requireAdminUser } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export default async function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, profile, member } = await requireAdminUser();

  if (!user || !profile) {
    // requireAdminUser 已 redirect；此處只為型別保護
    return null;
  }

  const userName =
    member?.name ??
    profile?.display_name ??
    user.user_metadata?.name ??
    user.email ??
    "管理者";

  return <AdminLayout userName={userName} role={profile.role}>{children}</AdminLayout>;
}

