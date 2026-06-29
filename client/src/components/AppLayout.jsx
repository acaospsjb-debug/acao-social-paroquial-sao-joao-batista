import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, externalHref, findExternalLink, whatsappLink } from '../api';
import { isPageVisible, normalizeVisiblePages, publicPages } from '../pages/publicPages';

export default function AppLayout() {
  const location = useLocation();
  const [site, setSite] = useState({ config: null, linksExternos: [], loaded: false });

  useEffect(() => {
    api('/api/site/resumo')
      .then((response) => setSite({ config: response.configuracoes, linksExternos: response.linksExternos || [], loaded: true }))
      .catch(() => setSite((current) => ({ ...current, loaded: true })));
  }, []);

  const visiblePages = normalizeVisiblePages(site.config?.paginas_visiveis);
  const currentPage = publicPages.find((page) => page.path === location.pathname);
  const pageIsHidden = site.loaded && currentPage && !isPageVisible(site.config, currentPage.key);
  const menuPages = publicPages.filter((page) => Boolean(visiblePages[page.key]));
  const whatsapp = findExternalLink(site.linksExternos, 'WhatsApp');
  const instagram = findExternalLink(site.linksExternos, 'Instagram');
  const facebook = findExternalLink(site.linksExternos, 'Facebook');
  const youtube = findExternalLink(site.linksExternos, 'YouTube');

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/" className="flex max-w-sm items-center gap-3 text-asp-ink">
            <img
              src="/logo.png"
              alt="Logo da Ação Social Paroquial São João Batista"
              className="h-14 w-14 shrink-0 rounded-full border border-emerald-100 bg-white object-contain shadow-sm"
            />
            <span className="text-base font-bold leading-tight sm:text-lg">
              Ação Social Paroquial São João Batista
            </span>
          </Link>
          <nav className="flex gap-3 overflow-x-auto text-sm font-medium text-slate-600">
            {menuPages.map((page) => (
              <NavLink key={page.path} to={page.path} className={({ isActive }) => `whitespace-nowrap rounded-full px-2.5 py-1 transition ${isActive ? 'bg-asp-soft text-asp-green' : 'hover:bg-asp-soft hover:text-asp-green'}`}>
                {page.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {pageIsHidden ? <HiddenPage /> : <Outlet context={{ config: site.config, linksExternos: site.linksExternos, visiblePages }} />}

      <a
        className="fixed bottom-4 right-4 z-40 rounded-md bg-[#25d366] px-4 py-3 text-sm font-bold text-white shadow-soft"
        href={externalHref(whatsapp, whatsappLink(site.config?.whatsapp))}
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>

      <footer className="border-t border-emerald-100 bg-asp-ink text-white">
        <div className="section grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-12 w-12 rounded-full bg-white object-contain" />
              <h2 className="font-bold">{site.config?.nome || 'Ação Social Paroquial São João Batista'}</h2>
            </div>
            <p className="mt-3 text-sm text-slate-200">49 anos de atuação em Itajaí/SC, aproximando solidariedade de famílias que precisam de cuidado.</p>
          </div>
          <div className="text-sm text-slate-200">
            <p>{site.config?.email}</p>
            <p>{site.config?.endereco}</p>
            <p>CNPJ: {site.config?.cnpj}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[instagram, facebook, youtube].filter(Boolean).map((link) => (
                <a key={link.id} className="font-semibold text-asp-yellow hover:text-white" href={link.url} target={Number(link.nova_aba) ? '_blank' : undefined} rel={Number(link.nova_aba) ? 'noopener noreferrer' : undefined}>
                  {link.nome}
                </a>
              ))}
            </div>
          </div>
          <div className="flex md:justify-end">
            <Link className="btn-primary" to="/admin">Painel administrativo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HiddenPage() {
  return (
    <main className="section">
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-asp-green">Página indisponível</p>
        <h1 className="mt-2 text-3xl font-bold text-asp-ink">Esta página está temporariamente oculta.</h1>
        <p className="mt-3 leading-7 text-slate-600">A ONG ainda está preparando este conteúdo. Use o menu para acessar as páginas disponíveis.</p>
        <Link className="btn-primary mt-6" to="/">Voltar para o início</Link>
      </div>
    </main>
  );
}
