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
  galeria: 'Altera as fotos exibidas na página Projeto Santa Dulce dos Pobres.',
  'links-externos': 'Centraliza Instagram, Facebook, WhatsApp, YouTube, doação e outros links usados no site.'
};

export default function CrudPage({ resource, title }) {
  const fields = configs[resource];
  const empty = useMemo(
    () => Object.fromEntries(fields.map(([name, , type]) => [name, type === 'checkbox' ? 1 : type === 'select' ? platformOptions[0] : ''])),
    [fields]
  );
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState('');
  const [uploadingField, setUploadingField] = useState('');
  const [saving, setSaving] = useState(false);
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
      setError('Não foi possível carregar os registros. Tente novamente.');
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
    setSaving(false);
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const path = editingId ? `/api/${resource}/${editingId}` : `/api/${resource}`;
      await api(path, { method, body: JSON.stringify(form) });
      notify(editingId ? 'Atualizado com êxito.' : 'Criado com êxito.');
      closeModal();
      load();
    } catch (_err) {
      notify('Não foi possível concluir a ação. Tente novamente.', 'error');
      setSaving(false);
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
      notify('Não foi possível excluir. Tente novamente.', 'error');
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
      notify('Falha no envio do arquivo.', 'error');
    } finally {
      setUploadingField('');
    }
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="eyebrow mb-3 inline-flex">Administração</span>
            <h1 className="text-3xl font-bold text-asp-ink">{title}</h1>
            <p className="mt-1 max-w-2xl text-asp-muted">{descriptions[resource]}</p>
          </div>
          <button className="btn-primary shrink-0 self-start" type="button" onClick={openNew}>
            <PlusIcon />
            Novo {title}
          </button>
        </div>

        {/* Aviso galeria */}
        {resource === 'galeria' && (
          <div className="flex items-start gap-3 rounded-xl border border-asp-sky-mid bg-asp-sky p-4 text-sm text-asp-blue">
            <InfoIcon />
            <span>As imagens cadastradas aqui aparecem em <strong>Projeto Santa Dulce dos Pobres</strong>, na seção Fotos do projeto.</span>
          </div>
        )}

        {/* Erro de carregamento */}
        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Lista de itens */}
        <section className="space-y-3" aria-label={`Lista de ${title}`}>
          {!items.length && (
            <div className="card p-10 text-center">
              <p className="text-asp-muted">Nenhum registro cadastrado ainda.</p>
              <button className="btn-primary mt-4" type="button" onClick={openNew}>
                Cadastrar primeiro {title}
              </button>
            </div>
          )}

          {items.map((item) => (
            <article key={item.id} className="card p-5 transition-shadow hover:shadow-soft">
              <div className="grid gap-4 sm:grid-cols-[120px_1fr_auto] sm:items-start">
                <ItemPreview item={item} resource={resource} />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-asp-ink">{item.titulo || item.nome}</h2>
                    {'ativo' in item && (
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        Number(item.ativo)
                          ? 'bg-asp-green-light text-asp-green'
                          : 'bg-asp-soft text-asp-muted'
                      }`}>
                        {Number(item.ativo) ? 'Ativo' : 'Inativo'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-asp-muted">
                    {item.descricao || item.resumo || item.conteudo || item.url}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {item.plataforma && (
                      <span className="rounded-full bg-asp-sky px-2 py-0.5 text-xs font-semibold text-asp-blue">{item.plataforma}</span>
                    )}
                    {item.data_evento && (
                      <span className="text-xs font-semibold text-asp-blue">{item.data_evento}</span>
                    )}
                    {item.categoria && (
                      <span className="rounded-full bg-asp-green-light px-2 py-0.5 text-xs font-semibold text-asp-green">{item.categoria}</span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    className="rounded-full border border-asp-border px-4 py-2 text-sm font-semibold text-asp-ink transition hover:bg-asp-soft"
                    type="button"
                    onClick={() => edit(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    type="button"
                    onClick={() => setDeleteItem(item)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* Modal de edição */}
      <Modal
        open={modalOpen}
        title={editingId ? `Editar ${title}` : `Novo ${title}`}
        onClose={closeModal}
        footer={(
          <>
            <button className="btn-secondary" type="button" onClick={closeModal} disabled={saving}>Cancelar</button>
            <button className="btn-primary disabled:opacity-60" type="submit" form="crud-form" disabled={saving}>
              {saving ? 'Salvando…' : editingId ? 'Atualizar' : 'Salvar'}
            </button>
          </>
        )}
      >
        <form id="crud-form" onSubmit={save} className="space-y-4">
          {fields.map(([name, label, type, help]) => (
            <div key={name}>
              {type !== 'checkbox' ? (
                <label htmlFor={`field-${name}`} className="form-label">{label}</label>
              ) : null}
              <Field
                id={`field-${name}`}
                field={name}
                label={label}
                type={type}
                value={form[name]}
                uploading={uploadingField === name}
                onUpload={handleUpload}
                onChange={(value) => setForm({ ...form, [name]: value })}
              />
              {help && <p className="mt-1.5 text-xs leading-5 text-asp-muted">{help}</p>}
            </div>
          ))}
        </form>
      </Modal>

      {/* Diálogo de exclusão */}
      <ConfirmDialog
        open={Boolean(deleteItem)}
        message={`Deseja excluir "${deleteItem?.titulo || deleteItem?.nome || 'este registro'}"? Esta ação não pode ser desfeita.`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={remove}
      />
    </>
  );
}

function ItemPreview({ item, resource }) {
  const image = item.imagem_url || item.logo_url;
  const label = item.titulo || item.nome || item.plataforma || 'Item';

  if (image) {
    return (
      <img
        src={image}
        alt={label}
        className="h-24 w-full rounded-xl border border-asp-border bg-asp-soft object-cover sm:h-20"
        loading="lazy"
      />
    );
  }

  return (
    <div className="flex h-24 w-full flex-col justify-between rounded-xl border border-asp-border bg-asp-sky p-3 sm:h-20">
      <span className="text-xs font-bold uppercase tracking-wide text-asp-blue opacity-60">{previewLabel(resource)}</span>
      <strong className="line-clamp-2 text-sm leading-tight text-asp-ink">{label}</strong>
    </div>
  );
}

function previewLabel(resource) {
  const labels = { projetos: 'Projeto', parceiros: 'Parceiro', 'noticias-eventos': 'Notícia', galeria: 'Foto', 'links-externos': 'Link' };
  return labels[resource] || 'Item';
}

function Field({ id, field, label, type, value, uploading, onChange, onUpload }) {
  if (type === 'textarea') {
    return (
      <textarea
        id={id}
        className="form-input min-h-28 resize-y"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (type === 'checkbox') {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-asp-border bg-white px-4 py-3 text-sm font-medium text-asp-ink hover:border-asp-blue hover:bg-asp-sky">
        <input
          id={id}
          type="checkbox"
          className="h-4 w-4 accent-asp-blue"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked ? 1 : 0)}
        />
        {label}
      </label>
    );
  }

  if (type === 'select') {
    return (
      <select
        id={id}
        className="form-input"
        value={value || platformOptions[0]}
        onChange={(e) => onChange(e.target.value)}
      >
        {platformOptions.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  }

  if (type === 'upload') {
    return (
      <div className="space-y-2">
        <input
          id={id}
          className="form-input text-sm file:mr-3 file:rounded-full file:border-0 file:bg-asp-sky file:px-3 file:py-1 file:text-xs file:font-semibold file:text-asp-blue"
          type="file"
          accept={field === 'link_url' ? '.pdf,.doc,.docx,image/*' : 'image/*'}
          onChange={(e) => onUpload(field, e.target.files?.[0])}
        />
        {uploading && (
          <p className="text-xs font-semibold text-asp-green">Enviando arquivo…</p>
        )}
        <input
          className="form-input text-sm"
          type="text"
          placeholder="Link gerado automaticamente ou link externo"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && field !== 'link_url' && (
          <img src={value} alt="Prévia" className="h-28 w-28 rounded-xl border border-asp-border object-cover" />
        )}
        {value && field === 'link_url' && (
          <a className="text-sm font-semibold text-asp-blue hover:text-asp-blue-dark" href={value} target="_blank" rel="noreferrer">
            Abrir documento →
          </a>
        )}
      </div>
    );
  }

  return (
    <input
      id={id}
      className="form-input"
      type={type === 'url' ? 'url' : 'text'}
      pattern={type === 'url' ? 'https?://.+' : undefined}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="mt-0.5 shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
