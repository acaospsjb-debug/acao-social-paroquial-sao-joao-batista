import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, whatsappLink } from '../api';

const nav = [
  ['/', 'Início'],
  ['/sobre', 'Sobre'],
  ['/projeto-santa-dulce', 'Santa Dulce'],
  ['/projetos', 'Projetos'],
  ['/campanhas', 'Campanhas'],
  ['/transparencia', 'Transparência'],
  ['/parceiros', 'Parceiros'],
  ['/noticias-eventos', 'Notícias'],
  ['/contato', 'Contato']
];

export default function AppLayout() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    api('/api/configuracoes').then(setConfig).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/" className="flex max-w-sm items-center gap-3 text-asp-ink">
            <img
              src="/logo.png"
              alt="Logo da Ação Social Paroquial São João Batista"
              className="h-14 w-14 shrink-0 rounded-full border border-slate-100 bg-white object-contain shadow-sm"
            />
            <span className="text-base font-bold leading-tight sm:text-lg">
              Ação Social Paroquial São João Batista
            </span>
          </Link>
          <nav className="flex gap-3 overflow-x-auto text-sm font-medium text-slate-600">
            {nav.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `whitespace-nowrap ${isActive ? 'text-asp-green' : 'hover:text-asp-green'}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <Outlet context={{ config }} />

      <a
        className="fixed bottom-4 right-4 z-40 rounded-md bg-[#25d366] px-4 py-3 text-sm font-bold text-white shadow-soft"
        href={whatsappLink(config?.whatsapp)}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>

      <footer className="border-t border-slate-100 bg-asp-ink text-white">
        <div className="section grid gap-6 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-12 w-12 rounded-full bg-white object-contain" />
              <h2 className="font-bold">{config?.nome || 'Ação Social Paroquial São João Batista'}</h2>
            </div>
            <p className="mt-3 text-sm text-slate-200">49 anos de atuação em Itajaí/SC, aproximando solidariedade de famílias que precisam de cuidado.</p>
          </div>
          <div className="text-sm text-slate-200">
            <p>{config?.email}</p>
            <p>{config?.endereco}</p>
            <p>CNPJ: {config?.cnpj}</p>
          </div>
          <div className="flex md:justify-end">
            <Link className="btn-primary" to="/admin">Painel administrativo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
