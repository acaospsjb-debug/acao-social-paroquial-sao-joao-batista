import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';

export default function Noticias() {
  const { noticiasEventos = [] } = useSiteData();

  return (
    <main className="section">
      <SectionHeader eyebrow="Notícias e eventos" title="Campanhas, encontros e ações comunitárias" />
      <div className="space-y-5">
        {noticiasEventos.map((item) => (
          <article key={item.id} className="card grid overflow-hidden md:grid-cols-[260px_1fr]">
            {item.imagem_url && <img src={item.imagem_url} alt={item.titulo} className="h-56 w-full object-cover md:h-full" />}
            <div className="p-6">
              <p className="text-sm font-bold text-asp-green">{item.data_evento}</p>
              <h2 className="mt-2 text-2xl font-bold">{item.titulo}</h2>
              <p className="mt-3 leading-7 text-slate-600">{item.resumo}</p>
              <p className="mt-3 text-slate-600">{item.conteudo}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
