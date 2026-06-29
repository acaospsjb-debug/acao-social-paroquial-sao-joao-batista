import { useEffect } from 'react';

/* ── Toast ── */
export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(id);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const styles = isError
    ? 'border-red-200 bg-red-50 text-red-800'
    : 'border-asp-green/30 bg-asp-green-light text-asp-green';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-soft ${styles}`}
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0 text-base">{isError ? '⚠' : '✓'}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        className="ml-auto shrink-0 rounded-full p-0.5 opacity-60 hover:opacity-100 transition"
        type="button"
        onClick={onClose}
        aria-label="Fechar mensagem"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

/* ── Modal ── */
export function Modal({ open, title, children, footer, onClose }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6"
      style={{ background: 'rgba(45,58,74,0.4)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-cta">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-asp-border px-6 py-4">
          <h2 className="text-lg font-bold text-asp-ink">{title}</h2>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-asp-muted transition hover:bg-asp-soft hover:text-asp-ink"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-asp-border bg-asp-soft px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Confirm Dialog ── */
export function ConfirmDialog({ open, title = 'Confirmar exclusão', message, onCancel, onConfirm }) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={(
        <>
          <button className="btn-secondary" type="button" onClick={onCancel}>Cancelar</button>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
            type="button"
            onClick={onConfirm}
          >
            Excluir
          </button>
        </>
      )}
    >
      <p className="leading-7 text-asp-muted">{message || 'Esta ação remove o registro selecionado. Deseja continuar?'}</p>
    </Modal>
  );
}

/* ── Hook Toast ── */
export function useToastState(setter) {
  return (message, type = 'success') => {
    setter({ message, type });
  };
}
