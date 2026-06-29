import { useEffect, useMemo, useState } from 'react';
import { api, uploadFile } from '../api';
import { ConfirmDialog, Modal, Toast, useToastState } from './AdminUi';

const configs = {
  projetos: [
    ['titulo', 'Título'],
    ['descricao', 'Descrição', 'textarea'],
    ['imagem_url', 'Imagem', 'upload', 'Escolha uma imagem do computador ou mantenha um link já cadastrado.'],
    ['destaque', 'Mostrar como destaque', 'checkbox'],
    ['ativo', 'Publicar no site', 'checkbox']
  ],
  parceiros: [
    ['nome', 'Nome'],
    ['descricao', 'Descrição', 'textarea'],
    ['logo_url', 'Logomarca', 'upload', 'Opcional. Escolha a imagem da logomarca do parceiro.'],
    ['site_url', 'Site do parceiro', 'url', 'Opcional.'],
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
  ],
  'links-externos': [
    ['nome', 'Nome'],
    ['url', 'URL', 'url', 'Use endereço completo, começando com https:// ou http://.'],
    ['plataforma', 'Tipo/plataforma', 'select', 'Escolha o canal correspondente.'],
    ['ativo', 'Link ativo', 'checkbox'],
    ['nova_aba', 'Abrir em nova aba', 'checkbox']
  ]
};

const platformOptions = ['Instagram', 'Facebook', 'WhatsApp', 'YouTube', 'Site externo', 'Doação'];

const descriptions = {
  projetos: 'Altera os cards da página Projetos e os destaques da página inicial.',
  parceiros: 'Altera os parceiros, apoiadores e logomarcas exibidos na página Parceiros e na página inicial.',
  'noticias-eventos': 'Altera notícias, eventos e comunicados exibidos na página Notícias.',
  documentos: 'Altera os documentos listados na página Transparência.',
  galeria: 'Altera as fotos exibidas na página Projeto Santa Dulce dos Pobres.',
  'links-externos': 'Centraliza Instagram, Facebook, WhatsApp, YouTube, doação e outros links usados no site.'
};

export default function CrudPage({ resource, title }) {
  const fields = configs[resource];
  const empty = useMemo(() => Object.fromEntries(fields.map(([name, , type]) => [name, type === 'checkbox' ? 1 : type === 'select' ? platformOptions[0] : ''])), [fields]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');
  const [uploadingField, setUploadingField] = useState('');
  const notify = useToastState(setToast);

  useEffect(() => {
    load();
    closeModal();
  }, [resource]);

  async function load() {
    try {
      setItems(await api(`/api/${resource}`));
      setError('');
    } catch (_err) {
      setError('Não foi possível concluir a ação. Tente novamente.');
    }
  }

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setModalOpen(true);
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ ...empty, ...item });
    setModalOpen(true);
  }

  function closeModal() {
    setEditingId(null);
    setForm(empty);
    setModalOpen(false);
    setUploadingField('');
  }

  async function save(event) {
    event.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/api/${resource}/${editingId}` : `/api/${resource}`;
      await api(path, { method, body: JSON.stringify(form) });
      notify(editingId ? 'Atualizado com êxito.' : 'Salvo com êxito.');
      closeModal();
      load();
    } catch (_err) {
      notify('Não foi possível concluir a ação. Tente novamente.', 'error');
    }
  }

  async function remove() {
    if (!deleteItem) return;
    try {
      await api(`/api/${resource}/${deleteItem.id}`, { method: 'DELETE' });
      setDeleteItem(null);
      notify('Excluído com êxito.');
      load();
    } catch (_err) {
      setDeleteItem(null);
      notify('Não foi possível concluir a ação. Tente novamente.', 'error');
    }
  }

  async function handleUpload(field, file) {
    if (!file) return;
    try {
      setUploadingField(field);
      const uploaded = await uploadFile(file);
      setForm((current) => ({ ...current, [field]: uploaded.url }));
      notify('Arquivo enviado. Salve o registro para concluir.');
    } catch (_err) {
      notify('Não foi possível concluir a ação. Tente novamente.', 'error');
    } finally {
      setUploadingField('');
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <div className="space-y-6">
        <header className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-asp-green">Administração</p>
            <h1 className="mt-1 text-3xl font-bold text-asp-ink">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{descriptions[resource]}</p>
          </div>
          <button className="btn-primary self-start" type="button" onClick={openNew}>Novo</button>
        </header>

        {error && <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</div>}
        {resource === 'galeria' && (
          <div className="rounded-lg border border-asp-green/20 bg-asp-soft p-5 text-sm leading-6 text-slate-700">
            As imagens cadastradas aqui aparecem em Projeto Santa Dulce dos Pobres, na seção Fotos do projeto.
          </div>
        )}

        <section className="grid gap-4">
          {!items.length && <div className="card p-6 text-slate-600">Nenhum registro cadastrado ainda.</div>}
          {items.map((item) => (
            <article key={item.id} className="card p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-asp-ink">{item.titulo || item.nome}</h2>
                    {'ativo' in item && (
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${Number(item.ativo) ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {Number(item.ativo) ? 'Ativo' : 'Inativo'}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-slate-600">{item.descricao || item.resumo || item.conteudo || item.url}</p>
                  {item.plataforma && <p className="mt-2 text-sm font-semibold text-asp-green">{item.plataforma}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50" type="button" onClick={() => edit(item)}>Editar</button>
                  <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50" type="button" onClick={() => setDeleteItem(item)}>Excluir</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

      <Modal
        open={modalOpen}
        title={editingId ? `Editar ${title}` : `Novo ${title}`}
        onClose={closeModal}
        footer={(
          <>
            <button className="btn-secondary" type="button" onClick={closeModal}>Cancelar</button>
            <button className="btn-primary" type="submit" form="crud-form">{editingId ? 'Atualizar' : 'Salvar'}</button>
          </>
        )}
      >
        <form id="crud-form" onSubmit={save} className="grid gap-4">
          {fields.map(([name, label, type, help]) => (
            <label key={name} className="grid gap-2 text-sm font-bold text-asp-ink">
              {label}
              <Field
                field={name}
                type={type}
                value={form[name]}
                uploading={uploadingField === name}
                onUpload={handleUpload}
                onChange={(value) => setForm({ ...form, [name]: value })}
              />
              {help && <span className="text-xs font-normal leading-5 text-slate-500">{help}</span>}
            </label>
          ))}
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteItem)}
        message={`Deseja excluir "${deleteItem?.titulo || deleteItem?.nome || 'este registro'}"?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={remove}
      />
    </>
  );
}

function Field({ field, type, value, uploading, onChange, onUpload }) {
  if (type === 'textarea') {
    return <textarea className="min-h-28 rounded-md border border-slate-200 p-3 font-normal" value={value || ''} onChange={(e) => onChange(e.target.value)} />;
  }

  if (type === 'checkbox') {
    return <input className="h-5 w-5" type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked ? 1 : 0)} />;
  }

  if (type === 'select') {
    return (
      <select className="rounded-md border border-slate-200 p-3 font-normal" value={value || platformOptions[0]} onChange={(e) => onChange(e.target.value)}>
        {platformOptions.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }

  if (type === 'upload') {
    return (
      <div className="grid gap-2">
        <input
          className="rounded-md border border-slate-200 p-3 font-normal"
          type="file"
          accept={field === 'link_url' ? '.pdf,.doc,.docx,image/*' : 'image/*'}
          onChange={(e) => onUpload(field, e.target.files?.[0])}
        />
        {uploading && <span className="text-xs font-normal text-asp-green">Enviando arquivo...</span>}
        <input className="rounded-md border border-slate-200 p-3 font-normal" placeholder="Link gerado automaticamente ou link externo" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        {value && field !== 'link_url' && <img src={value} alt="Prévia do arquivo enviado" className="h-28 w-28 rounded-md border object-cover" />}
        {value && field === 'link_url' && <a className="text-sm font-semibold text-asp-green" href={value} target="_blank" rel="noreferrer">Abrir documento</a>}
      </div>
    );
  }

  return (
    <input
      className="rounded-md border border-slate-200 p-3 font-normal"
      type={type === 'url' ? 'url' : 'text'}
      pattern={type === 'url' ? 'https?://.+' : undefined}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
