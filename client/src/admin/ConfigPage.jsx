import { useEffect, useState } from 'react';
import { api } from '../api';
import { Toast, useToastState } from './AdminUi';

const fields = [
  ['nome', 'Nome'],
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
  ['transparencia', 'Transparência'],
  ['parceiros', 'Parceiros'],
  ['noticias', 'Notícias'],
  ['contato', 'Contato']
];

const defaultPages = Object.fromEntries(pageFields.map(([key]) => [key, 1]));

export default function ConfigPage() {
  const [form, setForm] = useState({ paginas_visiveis: defaultPages });
  const [toast, setToast] = useState(null);
  const notify = useToastState(setToast);

  useEffect(() => {
    api('/api/configuracoes')
      .then((response) => setForm({ ...response, paginas_visiveis: normalizePages(response?.paginas_visiveis) }))
      .catch(() => notify('Não foi possível concluir a ação. Tente novamente.', 'error'));
  }, []);

  async function save(event) {
    event.preventDefault();
    try {
      const response = await api('/api/configuracoes', { method: 'PUT', body: JSON.stringify(form) });
      setForm({ ...response, paginas_visiveis: normalizePages(response?.paginas_visiveis) });
      notify('Salvo com êxito.');
    } catch (_error) {
      notify('Não foi possível concluir a ação. Tente novamente.', 'error');
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
        <header className="card p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-asp-green">Configurações</p>
          <h1 className="mt-1 text-3xl font-bold text-asp-ink">Informações do site</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Atualize os dados institucionais, o vídeo da página inicial e quais páginas aparecem no menu público.
          </p>
        </header>

        <section className="card p-6">
          <h2 className="text-xl font-bold text-asp-ink">Dados básicos da ONG</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {fields.map(([name, label, type]) => (
              <label key={name} className={`grid gap-2 text-sm font-bold text-asp-ink ${type === 'textarea' ? 'md:col-span-2' : ''}`}>
                {label}
                {type === 'textarea' ? (
                  <textarea className="min-h-32 rounded-md border border-slate-200 p-3 font-normal" value={form[name] || ''} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
                ) : (
                  <input className="rounded-md border border-slate-200 p-3 font-normal" value={form[name] || ''} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
                )}
              </label>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-bold text-asp-ink">Vídeo principal da página inicial</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Aceita links do YouTube, Vimeo ou URL direta de vídeo MP4. Se ficar vazio, o site usa imagem padrão.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-asp-ink">
              URL do vídeo
              <input className="rounded-md border border-slate-200 p-3 font-normal" type="url" placeholder="https://..." value={form.hero_video_url || ''} onChange={(e) => setForm({ ...form, hero_video_url: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm font-bold text-asp-ink">
              Poster do vídeo MP4
              <input className="rounded-md border border-slate-200 p-3 font-normal" type="url" placeholder="https://..." value={form.hero_video_poster_url || ''} onChange={(e) => setForm({ ...form, hero_video_poster_url: e.target.value })} />
            </label>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-xl font-bold text-asp-ink">Páginas visíveis no site</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Ao desativar uma página, ela sai do menu e mostra uma mensagem amigável em acesso direto.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pageFields.map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700">
                <input className="h-5 w-5" type="checkbox" checked={Boolean(pages[key])} onChange={(e) => updatePage(key, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
        </section>

        <div className="sticky bottom-0 flex justify-end border-t border-slate-100 bg-slate-50/95 py-4 backdrop-blur">
          <button className="btn-primary" type="submit">Salvar</button>
        </div>
      </form>
    </>
  );
}

function normalizePages(value) {
  return { ...defaultPages, ...(value || {}) };
}
