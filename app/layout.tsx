import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/auth/server";
import { getBrandFromSettings } from "@/lib/cms/brand";
import { fetchPublicSiteSettings } from "@/lib/cms/public-queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "森映球團",
    template: "%s｜森映球團",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsMap = await fetchPublicSiteSettings();
  const { siteName, tagline, logoUrl } = getBrandFromSettings(settingsMap);

  let isLoggedIn = false;
  let userRole: string | null = null;
  let displayName: string | null = null;
  try {
    const bundle = await getCurrentUser();
    isLoggedIn = Boolean(bundle.user);
    userRole = bundle.profile?.role ?? null;
    displayName =
      bundle.member?.name ??
      bundle.profile?.display_name ??
      bundle.user?.email ??
      null;
  } catch {
    /* getCurrentUser 內部已吞錯；此處雙重保險 */
  }

  return (
    <html lang="zh-Hant">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <Header
          siteName={siteName}
          logoUrl={logoUrl}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          displayName={displayName}
        />
        <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8">
          {children}
        </main>
        <Footer siteName={siteName} tagline={tagline} logoUrl={logoUrl} />
      </body>
    </html>
  );
}
