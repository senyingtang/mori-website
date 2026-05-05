type Props = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: Props) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.10)] bg-white/[0.06] px-6 py-10 shadow-[0_0_40px_rgba(31,20,16,0.12)] backdrop-blur-md md:px-10 md:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-[rgba(205,162,116,0.18)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[rgba(139,191,159,0.14)] blur-3xl"
      />
      <h1 className="relative text-3xl font-bold tracking-tight text-white md:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="relative mt-3 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
