import { useEffect, useMemo, useState } from 'react';
import { api, uploadFile } from '../api';

const configs = {
  projetos: [
    ['titulo', 'Título'],
    ['descricao', 'Descrição', 'textarea'],
    ['imagem_url', 'Imagem', 'upload', 'Escolha uma imagem do computador ou mantenha um link já cadastrado.'],
    ['destaque', 'Mostrar como destaque', 'checkbox'],
    ['ativo', 'Publicar no site', 'checkbox']
  ],
  campanhas: [
    ['titulo', 'Título'],
    ['descricao', 'Descrição', 'textarea'],
    ['meta', 'Meta', 'text', 'Exemplo: 100 cestas básicas, 300 pacotes de fraldas.'],
    ['status', 'Status', 'text', 'Exemplo: Em andamento, Planejada, Concluída.'],
    ['imagem_url', 'Imagem', 'upload', 'Opcional. O site não recebe pagamentos; use a descrição para orientar contato pelo WhatsApp.'],
    ['ativo', 'Publicar no site', 'checkbox']
  ],
  parceiros: [
    ['nome', 'Nome'],
    ['descricao', 'Descrição', 'textarea'],
    ['logo_url', 'Logomarca', 'upload', 'Opcional. Escolha a imagem da logomarca do parceiro.'],
    ['site_url', 'Site do parceiro', 'text', 'Opcional.'],
    ['ativo', 'Publicar no site', 'checkbox']
  ],
  'noticias-eventos': [
    ['titulo', 'Título'],
    ['resumo', 'Resumo', 'textarea'],
    ['conteudo', 'Conteúdo', 'textarea'],
    ['data_evento', 'Data do evento', 'text', 'Use o formato AAAA-MM-DD.'],
    ['imagem_url', 'Imagem', 'upload'],
    ['ativo', 'Publicar no site', 'checkbox']
  ],
  documentos: [
    ['nome', 'Nome'],
    ['descricao', 'Descrição', 'textarea'],
    ['link_url', 'Arquivo ou link do documento', 'upload', 'Envie PDF/Word ou mantenha # enquanto o arquivo real ainda não existir.'],
    ['tipo', 'Tipo', 'text', 'Exemplo: Estatuto, Relatório, Prestação de contas.']
  ],
  galeria: [
    ['titulo', 'Título'],
    ['descricao', 'Descrição', 'textarea'],
    ['imagem_url', 'Foto', 'upload', 'Escolha a foto do computador ou mantenha um link já cadastrado.'],
    ['categoria', 'Categoria', 'text', 'Exemplo: Santa Dulce, Ações, Eventos.']
  ]
};

const descriptions = {
  projetos: 'Altera os cards da página Projetos e os destaques da página inicial.',
  campanhas: 'Altera as campanhas e metas exibidas na página Campanhas e na página inicial.',
  parceiros: 'Altera os parceiros, apoiadores e logomarcas exibidos na página Parceiros e na página inicial.',
  'noticias-eventos': 'Altera notícias, eventos e campanhas informativas exibidas na página Notícias.',
  documentos: 'Altera os documentos listados na página Transparência.',
  galeria: 'Altera as fotos exibidas na página Projeto Santa Dulce dos Pobres, na seção “Fotos do projeto”. Use a categoria “Santa Dulce” para priorizar fotos nessa página.'
};

export default function CrudPage({ resource, title }) {
  const fields = configs[resource];
  const empty = useMemo(() => Object.fromEntries(fields.map(([name, , type]) => [name, type === 'checkbox' ? 1 : ''])), [fields]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploadingField, setUploadingField] = useState('');

  useEffect(() => {
    load();
    setForm(empty);
    setEditingId(null);
  }, [resource]);

  async function load() {
    try {
      setItems(await api(`/api/${resource}`));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function save(event) {
    event.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/api/${resource}/${editingId}` : `/api/${resource}`;
      await api(path, { method, body: JSON.stringify(form) });
      setMessage(editingId ? 'Registro atualizado.' : 'Registro criado.');
      setError('');
      setForm(empty);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Deseja excluir este registro?')) return;
    try {
      await api(`/api/${resource}/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ ...empty, ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleUpload(field, file) {
    if (!file) return;
    try {
      setUploadingField(field);
      setError('');
      const uploaded = await uploadFile(file);
      setForm((current) => ({ ...current, [field]: uploaded.url }));
      setMessage('Arquivo enviado. Clique em cadastrar ou atualizar para salvar o registro.');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingField('');
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
      <form onSubmit={save} className="card self-start p-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {descriptions[resource]} Preencha os campos principais e clique em cadastrar. Imagens, logomarcas e documentos podem ser enviados diretamente do computador.
        </p>
        {message && <p className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        {error && <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="mt-5 grid gap-4">
          {fields.map(([name, label, type, help]) => (
            <label key={name} className="grid gap-2 text-sm font-bold">
              {label}
              {type === 'textarea' ? (
                <textarea className="min-h-28 rounded-md border p-3 font-normal" value={form[name] || ''} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
              ) : type === 'checkbox' ? (
                <input className="h-5 w-5" type="checkbox" checked={Boolean(form[name])} onChange={(e) => setForm({ ...form, [name]: e.target.checked ? 1 : 0 })} />
              ) : type === 'upload' ? (
                <div className="grid gap-2">
                  <input
                    className="rounded-md border p-3 font-normal"
                    type="file"
                    accept={name === 'link_url' ? '.pdf,.doc,.docx,image/*' : 'image/*'}
                    onChange={(e) => handleUpload(name, e.target.files?.[0])}
                  />
                  {uploadingField === name && <span className="text-xs font-normal text-asp-green">Enviando arquivo...</span>}
                  <input
                    className="rounded-md border p-3 font-normal"
                    placeholder="Link gerado automaticamente ou link externo"
                    value={form[name] || ''}
                    onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  />
                  {form[name] && name !== 'link_url' && (
                    <img src={form[name]} alt="Prévia do arquivo enviado" className="h-28 w-28 rounded-md border object-cover" />
                  )}
                  {form[name] && name === 'link_url' && (
                    <a className="text-sm font-semibold text-asp-green" href={form[name]} target="_blank" rel="noreferrer">Abrir documento</a>
                  )}
                </div>
              ) : (
                <input className="rounded-md border p-3 font-normal" value={form[name] || ''} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
              )}
              {help && <span className="text-xs font-normal leading-5 text-slate-500">{help}</span>}
            </label>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn-primary" type="submit">{editingId ? 'Atualizar' : 'Cadastrar'}</button>
          {editingId && <button className="btn-secondary" type="button" onClick={() => { setEditingId(null); setForm(empty); }}>Cancelar</button>}
        </div>
      </form>

      <section className="space-y-4">
        {resource === 'galeria' && (
          <div className="rounded-lg border border-asp-green/20 bg-asp-soft p-5 text-sm leading-6 text-slate-700">
            As imagens cadastradas aqui aparecem em “Projeto Santa Dulce dos Pobres” na parte “Fotos do projeto”.
            Para trocar uma foto, clique em editar no item desejado, envie uma nova foto e depois clique em atualizar.
          </div>
        )}
        {!items.length && <div className="card p-6 text-slate-600">Nenhum registro cadastrado ainda.</div>}
        {items.map((item) => (
          <article key={item.id} className="card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">{item.titulo || item.nome}</h2>
                <p className="mt-2 line-clamp-3 text-slate-600">{item.descricao || item.resumo || item.conteudo}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-md border px-3 py-2 text-sm" onClick={() => edit(item)}>Editar</button>
                <button className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700" onClick={() => remove(item.id)}>Excluir</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
