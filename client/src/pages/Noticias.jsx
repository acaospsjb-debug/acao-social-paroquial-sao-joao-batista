import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';

export default function Noticias() {
  const { noticiasEventos = [] } = useSiteData();

  return (
    <div>
      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Notícias e eventos" title="Encontros, comunicados e ações comunitárias" />

          {noticiasEventos.length === 0 ? (
            <div className="card p-10 text-center text-asp-muted">
              <p className="text-lg font-medium">Em breve novidades por aqui.</p>
              <p className="mt-2 text-sm">Acompanhe nossas redes sociais para ficar atualizado.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {noticiasEventos.map((item) => (
                <article key={item.id} className="card grid overflow-hidden md:grid-cols-[280px_1fr]">
                  {item.imagem_url && (
                    <img
                      src={item.imagem_url}
                      alt={item.titulo}
                      className="h-56 w-full object-cover md:h-full"
                      loading="lazy"
                    />
                  )}
                  <div className="p-7">
                    {item.data_evento && (
                      <p className="text-sm font-bold text-asp-blue">{item.data_evento}</p>
                    )}
                    <h2 className="mt-2 text-2xl font-bold text-asp-ink">{item.titulo}</h2>
                    {item.resumo && <p className="mt-3 leading-7 text-asp-muted">{item.resumo}</p>}
                    {item.conteudo && <p className="mt-2 text-sm leading-7 text-asp-muted">{item.conteudo}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
