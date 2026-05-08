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
          <div className="rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 p-4 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8B735C]">
              目前登入
            </p>
            <p className="mt-2 text-sm font-semibold text-[#3A2A1E]">{userName}</p>
            <p className="mt-1 text-xs text-[#6F5A46]">role: {role}</p>
            <div className="mt-4 flex items-center gap-2">
              <Link
                href="/"
                className="rounded-lg border border-[rgba(90,62,43,0.14)] bg-[#FFF8ED]/80 px-3 py-2 text-xs font-semibold text-[#5A3E2B] transition hover:border-[rgba(185,133,82,0.35)]"
              >
                回前台
              </Link>
              <LogoutButton variant="compact" />
            </div>
          </div>

          <AdminSidebar role={role} />
        </div>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

