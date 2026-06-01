import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../api';

const links = [
  ['/admin', 'Início'],
  ['/admin/configuracoes', 'Sobre/Contato'],
  ['/admin/galeria', 'Fotos Santa Dulce'],
  ['/admin/projetos', 'Projetos'],
  ['/admin/campanhas', 'Campanhas'],
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
      <aside className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <strong>Painel ASP</strong>
          <nav className="flex gap-3 overflow-x-auto text-sm">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/admin'} className={({ isActive }) => `whitespace-nowrap font-semibold ${isActive ? 'text-asp-green' : 'text-slate-600'}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <button className="rounded-md border px-3 py-2 text-sm" onClick={logout}>Sair</button>
        </div>
      </aside>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
