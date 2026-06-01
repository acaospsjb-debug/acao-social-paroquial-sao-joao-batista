import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import SantaDulce from './pages/SantaDulce';
import Projetos from './pages/Projetos';
import Campanhas from './pages/Campanhas';
import Transparencia from './pages/Transparencia';
import Parceiros from './pages/Parceiros';
import Noticias from './pages/Noticias';
import Contato from './pages/Contato';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import CrudPage from './admin/CrudPage';
import ConfigPage from './admin/ConfigPage';
import { getAuthToken } from './api';

function Protected({ children }) {
  return getAuthToken() ? children : <Navigate to="/admin/login" replace />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/projeto-santa-dulce" element={<SantaDulce />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/transparencia" element={<Transparencia />} />
          <Route path="/parceiros" element={<Parceiros />} />
          <Route path="/noticias-eventos" element={<Noticias />} />
          <Route path="/contato" element={<Contato />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <Protected>
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="configuracoes" element={<ConfigPage />} />
          <Route path="projetos" element={<CrudPage resource="projetos" title="Projetos" />} />
          <Route path="campanhas" element={<CrudPage resource="campanhas" title="Campanhas e metas" />} />
          <Route path="parceiros" element={<CrudPage resource="parceiros" title="Parceiros" />} />
          <Route path="noticias-eventos" element={<CrudPage resource="noticias-eventos" title="Notícias e eventos" />} />
          <Route path="documentos" element={<CrudPage resource="documentos" title="Documentos de transparência" />} />
          <Route path="galeria" element={<CrudPage resource="galeria" title="Fotos Santa Dulce e galeria" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
