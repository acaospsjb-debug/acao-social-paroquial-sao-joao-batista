import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const response = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(form) });
      setAuthToken(response.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-asp-soft px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">Painel administrativo</h1>
        <p className="mt-2 text-slate-600">Acesse para editar conteúdos institucionais.</p>
        {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="mt-6 block text-sm font-bold">E-mail</label>
        <input className="mt-2 w-full rounded-md border p-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <label className="mt-4 block text-sm font-bold">Senha</label>
        <input className="mt-2 w-full rounded-md border p-3" type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
        <button className="btn-primary mt-6 w-full" type="submit">Entrar</button>
      </form>
    </main>
  );
}
