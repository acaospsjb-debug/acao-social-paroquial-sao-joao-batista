import { useEffect, useState } from 'react';
import { api } from '../api';
import { Toast, useToastState } from './AdminUi';

const SOCIAL_PLATFORMS = ['Instagram', 'YouTube'];

function isValidUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

const fields = [
  ['nome', 'Nome da instituição'],
  ['texto_institucional', 'Texto institucional', 'textarea'],
  ['whatsapp', 'WhatsApp'],
  ['email', 'E-mail'],
  ['endereco', 'Endereço'],
  ['cnpj', 'CNPJ']
];

const pageFields = [
  ['inicio', 'Início'],
  ['sobre', 'Sobre'],
  ['santa_dulce', 'Santa Dulce'],
  ['projetos', 'Projetos'],
  ['doacao', 'Doação'],
  ['parceiros', 'Parceiros'],
  ['noticias', 'Notícias'],
  ['contato', 'Contato']
];

const defaultPages = Object.fromEntries(pageFields.map(([key]) => [key, 1]));

export default function ConfigPage() {
  const [form, setForm] = useState({ paginas_visiveis: defaultPages });
  const [socialLinks, setSocialLinks] = useState({ Instagram: { url: '', id: null }, YouTube: { url: '', id: null } });
  const [urlErrors, setUrlErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const notify = useToastState(setToast);

  useEffect(() => {
    Promise.all([
      api('/api/configuracoes'),
      api('/api/links-externos')
    ]).then(([config, links]) => {
      setForm({ ...config, paginas_visiveis: normalizePages(config?.paginas_visiveis) });
      const updated = { Instagram: { url: '', id: null }, YouTube: { url: '', id: null } };
      (links || []).forEach((link) => {
        if (updated[link.plataforma] !== undefined) {
          updated[link.plataforma] = { url: link.url || '', id: link._id };
        }
      });
      setSocialLinks(updated);
    }).catch(() => notify('Não foi possível carregar as configurações.', 'error'));
  }, []);

  function setSocialUrl(platform, value) {
    setSocialLinks((prev) => ({ ...prev, [platform]: { ...prev[platform], url: value } }));
    setUrlErrors((prev) => ({ ...prev, [platform]: value && !isValidUrl(value) ? 'URL inválida. Use https://...' : '' }));
  }

  async function upsertSocialLink(platform, { url, id }) {
    const trimmed = url.trim();
    if (!trimmed && !id) return;
    if (id) {
      if (trimmed) {
        await api(`/api/links-externos/${id}`, { method: 'PUT', body: JSON.stringify({ nome: platform, url: trimmed, plataforma: platform, ativo: 1, nova_aba: 1 }) });
      } else {
        await api(`/api/links-externos/${id}`, { method: 'DELETE' });
      }
    } else if (trimmed) {
      const created = await api('/api/links-externos', { method: 'POST', body: JSON.stringify({ nome: platform, url: trimmed, plataforma: platform, ativo: 1, nova_aba: 1 }) });
      setSocialLinks((prev) => ({ ...prev, [platform]: { url: trimmed, id: created._id } }));
    }
  }

  async function save(event) {
    event.preventDefault();
    const errors = {};
    SOCIAL_PLATFORMS.forEach((p) => {
      const url = socialLinks[p].url.trim();
      if (url && !isValidUrl(url)) errors[p] = 'URL inválida. Use https://...';
    });
    if (Object.keys(errors).length) { setUrlErrors(errors); return; }

    setSaving(true);
    try {
      const response = await api('/api/configuracoes', { method: 'PUT', body: JSON.stringify(form) });
      setForm({ ...response, paginas_visiveis: normalizePages(response?.paginas_visiveis) });
      window.dispatchEvent(new CustomEvent('visible-pages-updated', { detail: normalizePages(response?.paginas_visiveis) }));
      await Promise.all(SOCIAL_PLATFORMS.map((p) => upsertSocialLink(p, socialLinks[p])));
      notify('Configurações salvas com êxito.');
    } catch (_error) {
      notify('Não foi possível salvar. Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function updatePage(page, checked) {
    setForm((current) => ({
      ...current,
      paginas_visiveis: { ...normalizePages(current.paginas_visiveis), [page]: checked ? 1 : 0 }
    }));
  }

  const pages = normalizePages(form.paginas_visiveis);

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <form onSubmit={save} className="space-y-6">
        {/* Cabeçalho */}
        <div>
          <span className="eyebrow mb-3 inline-flex">Configurações</span>
          <h1 className="text-3xl font-bold text-asp-ink">Informações do site</h1>
          <p className="mt-2 text-asp-muted">
            Atualize os dados institucionais, o vídeo da página inicial e as páginas visíveis no menu público.
          </p>
        </div>

        {/* Dados básicos */}
        <section className="card p-6">
          <h2 className="mb-5 text-lg font-bold text-asp-ink">Dados básicos da ONG</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map(([name, label, type]) => (
              <div key={name} className={type === 'textarea' ? 'md:col-span-2' : ''}>
                <label htmlFor={`config-${name}`} className="form-label">{label}</label>
                {type === 'textarea' ? (
                  <textarea
                    id={`config-${name}`}
                    className="form-input min-h-28 resize-y"
                    value={form[name] || ''}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  />
                ) : (
                  <input
                    id={`config-${name}`}
                    type="text"
                    className="form-input"
                    value={form[name] || ''}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Redes sociais */}
        <section className="card p-6">
          <h2 className="mb-2 text-lg font-bold text-asp-ink">Redes sociais</h2>
          <p className="mb-5 text-sm text-asp-muted">
            Informe os links completos. Os ícones aparecerão automaticamente no rodapé do site. Deixe em branco para ocultar.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {[
              { platform: 'Instagram', placeholder: 'https://www.instagram.com/nomedainstituicao', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-pink-500" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              )},
              { platform: 'YouTube', placeholder: 'https://www.youtube.com/@nomedocanal', icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-red-500" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              )},
            ].map(({ platform, placeholder, icon }) => (
              <div key={platform}>
                <label htmlFor={`social-${platform}`} className="form-label flex items-center gap-2">
                  {icon} Link do {platform}
                </label>
                <input
                  id={`social-${platform}`}
                  type="url"
                  className={`form-input ${urlErrors[platform] ? 'border-red-400 focus:ring-red-300' : ''}`}
                  placeholder={placeholder}
                  value={socialLinks[platform].url}
                  onChange={(e) => setSocialUrl(platform, e.target.value)}
                />
                {urlErrors[platform] && <p className="mt-1 text-xs text-red-500">{urlErrors[platform]}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Vídeo */}
        <section className="card p-6">
          <h2 className="mb-2 text-lg font-bold text-asp-ink">Vídeo principal da página inicial</h2>
          <p className="mb-5 text-sm text-asp-muted">
            Aceita links do YouTube, Vimeo ou URL direta de vídeo MP4. Se ficar vazio, o site usa imagem padrão.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="config-video-url" className="form-label">URL do vídeo</label>
              <input
                id="config-video-url"
                type="url"
                className="form-input"
                placeholder="https://youtube.com/watch?v=..."
                value={form.hero_video_url || ''}
                onChange={(e) => setForm({ ...form, hero_video_url: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="config-video-poster" className="form-label">Poster do vídeo MP4 (opcional)</label>
              <input
                id="config-video-poster"
                type="url"
                className="form-input"
                placeholder="https://..."
                value={form.hero_video_poster_url || ''}
                onChange={(e) => setForm({ ...form, hero_video_poster_url: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Páginas visíveis */}
        <section className="card p-6">
          <h2 className="mb-2 text-lg font-bold text-asp-ink">Páginas visíveis no site</h2>
          <p className="mb-5 text-sm text-asp-muted">
            Ao desativar uma página, ela sai do menu e exibe mensagem amigável em acesso direto.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pageFields.map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-asp-border bg-white px-4 py-3 text-sm font-medium text-asp-ink transition hover:border-asp-blue hover:bg-asp-sky"
              >
                <input
                  className="h-4 w-4 accent-asp-blue"
                  type="checkbox"
                  checked={Boolean(pages[key])}
                  onChange={(e) => updatePage(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        {/* Barra de salvar fixa */}
        <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-asp-border bg-white/95 py-4 backdrop-blur">
          <p className="text-sm text-asp-muted">As alterações ficam disponíveis após salvar.</p>
          <button className="btn-primary disabled:opacity-60" type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar configurações'}
          </button>
        </div>
      </form>
    </>
  );
}

function normalizePages(value) {
  return { ...defaultPages, ...(value || {}) };
}
