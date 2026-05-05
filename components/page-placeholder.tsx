type Props = {
  title: string;
  description?: string;
};

/** 第一版路由骨架：標題 + 說明，後續替換為各頁完整內容 */
export function PagePlaceholder({ title, description }: Props) {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] p-8 backdrop-blur-sm">
      <h1 className="text-2xl font-bold text-white md:text-3xl">{title}</h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-white/65">{description}</p>
      ) : null}
      <p className="mt-6 text-sm text-white/45">
        此頁面為路由骨架；內容與表單將於後續 Phase 串接 CMS／Supabase。
      </p>
    </div>
  );
}
