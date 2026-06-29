import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, clearAuthToken } from '../api';
import { normalizeVisiblePages } from '../pages/publicPages';

const links = [
  { to: '/admin', label: 'Início', icon: HomeIcon },
  { to: '/admin/configuracoes', label: 'Configurações', icon: SettingsIcon },
  { to: '/admin/links-externos', label: 'Links externos', icon: LinkIcon },
  { to: '/admin/galeria', label: 'Fotos Santa Dulce', pageKey: 'santa_dulce', icon: PhotoIcon },
  { to: '/admin/projetos', label: 'Projetos', pageKey: 'projetos', icon: FolderIcon },
  { to: '/admin/parceiros', label: 'Parceiros', pageKey: 'parceiros', icon: HandshakeIcon },
  { to: '/admin/noticias-eventos', label: 'Notícias', pageKey: 'noticias', icon: NewsIcon }
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visiblePages, setVisiblePages] = useState(normalizeVisiblePages());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleVisiblePages(event) {
      setVisiblePages(normalizeVisiblePages(event.detail));
    }

    api('/api/configuracoes')
      .then((config) => setVisiblePages(normalizeVisiblePages(config?.paginas_visiveis)))
      .catch(() => setVisiblePages(normalizeVisiblePages()));
    window.addEventListener('visible-pages-updated', handleVisiblePages);
    return () => window.removeEventListener('visible-pages-updated', handleVisiblePages);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    const currentLink = links.find((link) => link.to === location.pathname);
    if (currentLink?.pageKey && !visiblePages[currentLink.pageKey]) {
      navigate('/admin', { replace: true });
    }
  }, [location.pathname, navigate, visiblePages]);

  function logout() {
    clearAuthToken();
    navigate('/admin/login');
  }

  const visibleLinks = links.filter((link) => !link.pageKey || visiblePages[link.pageKey]);

  return (
    <div className="min-h-screen bg-asp-soft">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-asp-border bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-9 w-9 rounded-full border border-asp-border bg-white object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-bold uppercase tracking-widest text-asp-blue">Painel Admin</p>
              <p className="text-xs text-asp-muted leading-none">ASP São João Batista</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu admin">
            {visibleLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-asp-sky text-asp-blue font-semibold'
                      : 'text-asp-muted hover:bg-asp-soft hover:text-asp-blue'
                  }`
                }
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-asp-border px-3 py-1.5 text-xs font-semibold text-asp-muted transition hover:bg-asp-soft sm:inline-flex"
            >
              Ver site
            </a>
            <button
              onClick={logout}
              className="rounded-full border border-asp-border px-3 py-1.5 text-xs font-semibold text-asp-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Sair
            </button>
            {/* Hamburger mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-asp-border text-asp-muted transition hover:bg-asp-soft lg:hidden"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <nav className="border-t border-asp-border bg-white px-4 pb-4 pt-2 lg:hidden" aria-label="Menu admin mobile">
            <ul className="space-y-1">
              {visibleLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-asp-sky text-asp-blue font-semibold'
                          : 'text-asp-ink hover:bg-asp-soft'
                      }`
                    }
                  >
                    <Icon />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* Conteúdo */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

/* ── Ícones SVG inline (stroke, 16×16) ── */
function HomeIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
}
function SettingsIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}
function LinkIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
}
function PhotoIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;
}
function FolderIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>;
}
function HandshakeIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg>;
}
function NewsIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6z" /></svg>;
}
function MenuIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
}
function CloseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
