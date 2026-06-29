export default function SectionHeader({ eyebrow, title, children, centered = false }) {
  return (
    <div className={`mb-10 ${centered ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'}`}>
      {eyebrow && (
        <span className="eyebrow mb-4 inline-flex">{eyebrow}</span>
      )}
      <h2 className="text-3xl font-bold leading-tight text-asp-ink md:text-4xl">{title}</h2>
      {children && (
        <p className="mt-4 text-lg leading-8 text-asp-muted">{children}</p>
      )}
    </div>
  );
}
