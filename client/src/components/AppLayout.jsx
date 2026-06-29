import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, externalHref, findExternalLink, hasValidCnpj, whatsappLink } from '../api';
import { isPageVisible, normalizeVisiblePages, publicPages } from '../pages/publicPages';

export default function AppLayout() {
  const location = useLocation();
  const [site, setSite] = useState({ config: null, linksExternos: [], loaded: false });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api('/api/site/resumo')
      .then((response) => setSite({ config: response.configuracoes, linksExternos: response.linksExternos || [], loaded: true }))
      .catch(() => setSite((current) => ({ ...current, loaded: true })));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const visiblePages = normalizeVisiblePages(site.config?.paginas_visiveis);
  const currentPage = publicPages.find((page) => page.path === location.pathname);
  const pageIsHidden = site.loaded && currentPage && !isPageVisible(site.config, currentPage.key);
  const menuPages = publicPages.filter((page) => Boolean(visiblePages[page.key]));
  const whatsapp = findExternalLink(site.linksExternos, 'WhatsApp');
  const showCnpj = hasValidCnpj(site.config?.cnpj);
  const doacao = visiblePages.doacao;
  const SOCIAL_ICONS = {
    Instagram: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
    YouTube: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    Facebook: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    X: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    LinkedIn: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    TikTok: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>,
  };
  const socialLinks = site.linksExternos.filter(
    (l) => l.ativo && l.url && l.plataforma && l.plataforma !== 'WhatsApp' && l.plataforma !== 'Doação'
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header fixo */}
      <header className="sticky top-0 z-30 bg-asp-blue shadow-cta">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="Página inicial">
            <img
              src="/logo.png"
              alt="Logo da Ação Social Paroquial São João Batista"
              className="h-12 w-12 shrink-0 rounded-full border-2 border-white/30 bg-white object-contain shadow-sm"
            />
            <span className="hidden text-sm font-bold leading-tight text-white sm:block sm:max-w-[200px] md:max-w-xs">
              Ação Social Paroquial<br />
              <span className="font-normal text-white/80">São João Batista</span>
            </span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-1 text-sm font-medium lg:flex" aria-label="Menu principal">
            {menuPages.map((page) => (
              <NavLink
                key={page.path}
                to={page.path}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {page.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            {doacao && (
              <Link
                to="/doacao"
                className="hidden rounded-full bg-asp-warm px-4 py-2 text-sm font-bold text-asp-ink shadow-soft transition hover:bg-asp-warm-dark sm:inline-flex"
              >
                Doe agora
              </Link>
            )}
            {/* Botão hamburger mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/15 lg:hidden"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile dropdown */}
        {menuOpen && (
          <nav className="border-t border-white/20 bg-asp-blue px-4 pb-4 pt-2 lg:hidden" aria-label="Menu mobile">
            <ul className="space-y-1">
              {menuPages.map((page) => (
                <li key={page.path}>
                  <NavLink
                    to={page.path}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white font-semibold'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {page.label}
                  </NavLink>
                </li>
              ))}
              {doacao && (
                <li className="pt-2">
                  <Link to="/doacao" className="btn-cta w-full justify-center">
                    Doe agora
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>

      {/* Conteúdo principal */}
      <main id="main-content">
        {pageIsHidden ? <HiddenPage /> : <Outlet context={{ config: site.config, linksExternos: site.linksExternos, visiblePages }} />}
      </main>

      {/* Botão flutuante WhatsApp */}
      <a
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-bold text-white shadow-cta transition hover:bg-[#1ea855]"
        href={externalHref(whatsapp, whatsappLink(site.config?.whatsapp))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a13 13 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.527 5.845L.057 23.857l6.188-1.622A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-4.999-1.365l-.358-.213-3.712.973.991-3.619-.234-.372A9.791 9.791 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
        </svg>
        <span className="hidden sm:inline">WhatsApp</span>
      </a>

      {/* Rodapé */}
      <footer className="bg-asp-blue text-white">
        <div className="section grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-12 w-12 rounded-full bg-white object-contain shadow-sm" />
              <p className="font-bold text-white leading-snug">{site.config?.nome || 'Ação Social Paroquial São João Batista'}</p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Há 49 anos atuando na cidade de Itajaí/SC, aproximando solidariedade de quem mais precisa.
            </p>
          </div>
          <div>
            <h3 className="mb-3 font-bold text-white text-sm uppercase tracking-wide">Contato</h3>
            <div className="space-y-1.5 text-sm text-white/70">
              {site.config?.whatsapp && <p>WhatsApp: {site.config.whatsapp}</p>}
              {site.config?.email && <p>{site.config.email}</p>}
              {site.config?.endereco && <p>{site.config.endereco}</p>}
              {showCnpj && <p className="text-xs pt-1">CNPJ: {site.config?.cnpj}</p>}
            </div>
          </div>
          {socialLinks.length > 0 && (
            <div>
              <h3 className="mb-3 font-bold text-white text-sm uppercase tracking-wide">Redes sociais</h3>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.plataforma} da Ação Social Paroquial São João Batista`}
                    title={link.plataforma}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/20 hover:border-white/60"
                  >
                    {SOCIAL_ICONS[link.plataforma] || (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-white/20 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Ação Social Paroquial São João Batista. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

function HiddenPage() {
  return (
    <div className="section">
      <div className="card mx-auto max-w-2xl p-10 text-center">
        <span className="eyebrow">Página indisponível</span>
        <h1 className="mt-4 text-3xl font-bold text-asp-ink">Esta página está temporariamente oculta.</h1>
        <p className="mt-3 leading-7 text-asp-muted">A ONG ainda está preparando este conteúdo. Use o menu para acessar as páginas disponíveis.</p>
        <Link className="btn-primary mt-8" to="/">Voltar para o início</Link>
      </div>
    </div>
  );
}
