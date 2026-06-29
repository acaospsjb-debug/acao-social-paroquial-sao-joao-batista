export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const styles = toast.type === 'error'
    ? 'border-red-200 bg-red-50 text-red-800'
    : 'border-emerald-200 bg-emerald-50 text-emerald-800';

  return (
    <div className={`fixed right-4 top-4 z-50 max-w-sm rounded-md border px-4 py-3 text-sm font-semibold shadow-soft ${styles}`}>
      <div className="flex items-start gap-3">
        <span>{toast.message}</span>
        <button className="ml-auto text-lg leading-none opacity-70 hover:opacity-100" type="button" onClick={onClose} aria-label="Fechar mensagem">
          ×
        </button>
      </div>
    </div>
  );
}

export function Modal({ open, title, children, footer, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 px-4 py-6">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold text-asp-ink">{title}</h2>
          <button className="rounded-md border border-slate-200 px-3 py-1 text-xl leading-none text-slate-600 hover:bg-slate-50" type="button" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        <div className="max-h-[68vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title = 'Confirmar exclusão', message, onCancel, onConfirm }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={(
        <>
          <button className="btn-secondary" type="button" onClick={onCancel}>Cancelar</button>
          <button className="rounded-md bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700" type="button" onClick={onConfirm}>Excluir</button>
        </>
      )}
    >
      <p className="leading-7 text-slate-600">{message || 'Esta ação remove o registro selecionado. Deseja continuar?'}</p>
    </Modal>
  );
}

export function useToastState(setter) {
  return (message, type = 'success') => {
    setter({ message, type });
    window.setTimeout(() => setter(null), 3200);
  };
}
