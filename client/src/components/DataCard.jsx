export default function DataCard({ item, type = 'projeto' }) {
  const image = item.imagem_url || item.logo_url;
  return (
    <article className="card flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-soft">
      {image ? (
        <img
          src={image}
          alt={item.titulo || item.nome}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-36 items-center justify-center bg-asp-sky px-6 text-center">
          <span className="text-2xl font-bold text-asp-blue/60">{(item.nome || item.titulo || '').charAt(0)}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-asp-ink">{item.titulo || item.nome}</h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-asp-muted">{item.descricao || item.resumo}</p>
        {type === 'campanha' && item.meta && (
          <div className="mt-4 rounded-xl border border-asp-border bg-asp-soft p-3 text-sm">
            <strong className="text-asp-ink">Meta:</strong> <span className="text-asp-muted">{item.meta}</span><br />
            <strong className="text-asp-ink">Status:</strong> <span className="text-asp-muted">{item.status}</span>
          </div>
        )}
      </div>
    </article>
  );
}
