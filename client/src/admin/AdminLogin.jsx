import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api('/api/auth/login', { method: 'POST', body: JSON.stringify(form) });
      setAuthToken(response.token);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-asp-soft px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / identidade */}
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="Logo da Ação Social Paroquial São João Batista"
            className="mx-auto h-16 w-16 rounded-full border border-asp-border bg-white object-contain shadow-soft"
          />
          <h1 className="mt-4 text-2xl font-bold text-asp-ink">Painel Administrativo</h1>
          <p className="mt-1 text-sm text-asp-muted">Ação Social Paroquial São João Batista</p>
        </div>

        {/* Card de login */}
        <div className="card p-8">
          {error && (
            <div role="alert" className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-base">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="login-email" className="form-label">E-mail</label>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="login-senha" className="form-label">Senha</label>
                <div className="relative">
                  <input
                    id="login-senha"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input pr-12"
                    value={form.senha}
                    onChange={(e) => setForm({ ...form, senha: e.target.value })}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-asp-muted hover:text-asp-ink"
                    aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>

            <button
              className="btn-primary mt-6 w-full justify-center disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-asp-muted">
          Acesso restrito a administradores da instituição.
        </p>
      </div>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
