type Props = {
  content: string;
};

/**
 * 將純文字依空行分段；單行以換行顯示（white-space: pre-line）
 */
export function PolicyProse({ content }: Props) {
  const blocks = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6 text-sm leading-relaxed text-[#6F5A46] md:text-base md:leading-relaxed">
      {blocks.map((block, i) => (
        <p key={i} className="whitespace-pre-line">
          {block}
        </p>
      ))}
    </div>
  );
}
