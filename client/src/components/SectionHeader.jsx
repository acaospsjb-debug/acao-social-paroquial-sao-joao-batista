export default function SectionHeader({ eyebrow, title, children }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-wide text-asp-green">{eyebrow}</p>}
      <h1 className="text-3xl font-bold leading-tight text-asp-ink md:text-4xl">{title}</h1>
      {children && <p className="mt-4 text-lg leading-8 text-slate-600">{children}</p>}
    </div>
  );
}
