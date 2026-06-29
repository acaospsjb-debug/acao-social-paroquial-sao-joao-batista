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
  const instagram = findExternalLink(site.linksExternos, 'Instagram');
  const facebook = findExternalLink(site.linksExternos, 'Facebook');
  const youtube = findExternalLink(site.linksExternos, 'YouTube');
  const showCnpj = hasValidCnpj(site.config?.cnpj);
  const doacao = visiblePages.doacao;

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
              <div>
                <p className="font-bold text-white">{site.config?.nome || 'Ação Social Paroquial'}</p>
                <p className="text-sm text-white/70 font-medium">São João Batista</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              49 anos de atuação em Itajaí/SC, aproximando solidariedade de famílias que precisam de cuidado.
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
          <div>
            <h3 className="mb-3 font-bold text-white text-sm uppercase tracking-wide">Redes sociais</h3>
            <div className="flex flex-wrap gap-3">
              {[instagram, facebook, youtube].filter(Boolean).map((link) => (
                <a
                  key={link.id}
                  className="rounded-full border border-white/30 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/15"
                  href={link.url}
                  target={Number(link.nova_aba) ? '_blank' : undefined}
                  rel={Number(link.nova_aba) ? 'noopener noreferrer' : undefined}
                >
                  {link.nome}
                </a>
              ))}
            </div>
          </div>
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
