import { useEffect, useState } from 'react';
import { api } from '../api';
import { Toast, useToastState } from './AdminUi';

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
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const notify = useToastState(setToast);

  useEffect(() => {
    api('/api/configuracoes')
      .then((config) => {
        setForm({ ...config, paginas_visiveis: normalizePages(config?.paginas_visiveis) });
      })
      .catch(() => notify('Não foi possível carregar as configurações.', 'error'));
  }, []);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api('/api/configuracoes', { method: 'PUT', body: JSON.stringify(form) });
      setForm({ ...response, paginas_visiveis: normalizePages(response?.paginas_visiveis) });
      window.dispatchEvent(new CustomEvent('visible-pages-updated', { detail: normalizePages(response?.paginas_visiveis) }));
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
