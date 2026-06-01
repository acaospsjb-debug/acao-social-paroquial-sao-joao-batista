export default function DataCard({ item, type = 'projeto' }) {
  const image = item.imagem_url || item.logo_url;
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {image ? (
        <img src={image} alt={item.titulo || item.nome} className="h-48 w-full object-cover" />
      ) : (
        <div className="flex h-32 items-center justify-center bg-asp-soft px-6 text-center font-bold text-asp-green">{item.nome || item.titulo}</div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-bold text-asp-ink">{item.titulo || item.nome}</h3>
        <p className="mt-3 leading-7 text-slate-600">{item.descricao || item.resumo}</p>
        {type === 'campanha' && (
          <div className="mt-auto rounded-md bg-asp-soft p-3 text-sm">
            <strong>Meta:</strong> {item.meta || 'A combinar'} <br />
            <strong>Status:</strong> {item.status}
          </div>
        )}
      </div>
    </article>
  );
}
