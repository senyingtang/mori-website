import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/auth/LogoutButton";

type Props = {
  userName: string;
  role: string;
  children: React.ReactNode;
};

export function AdminLayout({ userName, role, children }: Props) {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              目前登入
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{userName}</p>
            <p className="mt-1 text-xs text-white/55">role: {role}</p>
            <div className="mt-4 flex items-center gap-2">
              <Link
                href="/"
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/10"
              >
                回前台
              </Link>
              <LogoutButton variant="compact" />
            </div>
          </div>

          <AdminSidebar />
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

