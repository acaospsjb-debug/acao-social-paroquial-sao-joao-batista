import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { normalizeVisiblePages } from '../pages/publicPages';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [visiblePages, setVisiblePages] = useState(normalizeVisiblePages());

  useEffect(() => {
    Promise.all([api('/api/admin/dashboard'), api('/api/configuracoes')])
      .then(([dashboard, config]) => {
        setData(dashboard);
        setVisiblePages(normalizeVisiblePages(config?.paginas_visiveis));
      })
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Fotos Santa Dulce', value: data?.galeria, pageKey: 'santa_dulce', text: 'Imagens na página do projeto.', to: '/admin/galeria', color: 'blue' },
    { label: 'Projetos', value: data?.projetos, pageKey: 'projetos', text: 'Cards exibidos no site público.', to: '/admin/projetos', color: 'green' },
    { label: 'Links externos', value: data?.linksExternos, text: 'WhatsApp, redes sociais e doação.', to: '/admin/links-externos', color: 'coral' },
    { label: 'Parceiros', value: data?.parceiros, pageKey: 'parceiros', text: 'Apoiadores exibidos no site.', to: '/admin/parceiros', color: 'warm' },
    { label: 'Notícias/eventos', value: data?.noticiasEventos, pageKey: 'noticias', text: 'Comunicados e registros.', to: '/admin/noticias-eventos', color: 'blue' }
  ].filter((card) => !card.pageKey || visiblePages[card.pageKey]);

  const colorMap = {
    blue: 'bg-asp-sky text-asp-blue',
    green: 'bg-asp-green-light text-asp-green',
    coral: 'bg-asp-coral-light text-asp-coral',
    warm: 'bg-asp-yellow text-asp-ink',
  };

  return (
    <div className="space-y-8">
      {/* Título */}
      <div>
        <span className="eyebrow mb-3 inline-flex">Visão geral</span>
        <h1 className="text-3xl font-bold text-asp-ink">Painel administrativo</h1>
        <p className="mt-2 text-asp-muted">Gerencie os conteúdos exibidos no site da Ação Social Paroquial São João Batista.</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, text, to, color }) => (
          <Link
            key={label}
            to={to}
            className="card group flex flex-col gap-4 p-6 transition-shadow hover:shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${colorMap[color] || colorMap.blue}`}>
                {label}
              </div>
              <svg className="text-asp-muted/40 group-hover:text-asp-blue transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div>
              <strong className="block text-4xl font-bold text-asp-ink tabular-nums">
                {value ?? <span className="text-asp-muted/40">—</span>}
              </strong>
              <p className="mt-1 text-sm leading-5 text-asp-muted">{text}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="card p-6">
        <h2 className="mb-4 text-base font-bold text-asp-ink">Ações rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link className="btn-primary text-sm" to="/admin/configuracoes">Editar configurações do site</Link>
          <Link className="btn-secondary text-sm" to="/admin/projetos">Gerenciar projetos</Link>
          <a className="btn-secondary text-sm" href="/" target="_blank" rel="noopener noreferrer">Ver site público</a>
        </div>
      </div>
    </div>
  );
}
