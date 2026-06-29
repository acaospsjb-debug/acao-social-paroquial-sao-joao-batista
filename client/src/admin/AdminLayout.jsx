import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../api';

const links = [
  ['/admin', 'Início'],
  ['/admin/configuracoes', 'Site'],
  ['/admin/links-externos', 'Links externos'],
  ['/admin/galeria', 'Fotos Santa Dulce'],
  ['/admin/projetos', 'Projetos'],
  ['/admin/documentos', 'Transparência'],
  ['/admin/parceiros', 'Parceiros'],
  ['/admin/noticias-eventos', 'Notícias']
];

export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    clearAuthToken();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="border-b border-emerald-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <strong className="text-lg text-asp-ink">Painel ASP</strong>
          <nav className="flex gap-2 overflow-x-auto text-sm">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/admin'} className={({ isActive }) => `whitespace-nowrap rounded-full px-3 py-2 font-semibold transition ${isActive ? 'bg-asp-soft text-asp-green' : 'text-slate-600 hover:bg-slate-100 hover:text-asp-green'}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={logout}>Sair</button>
        </div>
      </aside>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
