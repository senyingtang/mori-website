type Props = {
  title: string;
  subtitle?: string;
};

export function PageHero({ title, subtitle }: Props) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-2xl border border-[rgba(90,62,43,0.14)] bg-[rgba(255,248,237,0.72)] px-6 py-10 shadow-[0_22px_60px_rgba(90,62,43,0.10)] backdrop-blur-md md:px-10 md:py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full blur-3xl"
        style={{ background: "rgba(214,168,108,0.26)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full blur-3xl"
        style={{ background: "rgba(111,163,123,0.18)" }}
      />
      <h1 className="relative text-3xl font-bold tracking-tight text-[#3A2A1E] md:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="relative mt-3 max-w-3xl text-sm leading-relaxed text-[#6F5A46] md:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
