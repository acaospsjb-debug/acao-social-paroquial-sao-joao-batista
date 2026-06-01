import { useEffect, useState } from 'react';
import { api } from '../api';

const fields = [
  ['nome', 'Nome'],
  ['texto_institucional', 'Texto institucional', 'textarea'],
  ['whatsapp', 'WhatsApp'],
  ['email', 'E-mail'],
  ['endereco', 'Endereço'],
  ['cnpj', 'CNPJ']
];

export default function ConfigPage() {
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    api('/api/configuracoes').then(setForm);
  }, []);

  async function save(event) {
    event.preventDefault();
    const response = await api('/api/configuracoes', { method: 'PUT', body: JSON.stringify(form) });
    setForm(response);
    setMessage('Informações salvas.');
  }

  return (
    <form onSubmit={save} className="card max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Informações básicas da ONG</h1>
      {message && <p className="mt-4 rounded-md bg-green-50 p-3 text-green-700">{message}</p>}
      <div className="mt-6 grid gap-4">
        {fields.map(([name, label, type]) => (
          <label key={name} className="grid gap-2 text-sm font-bold">
            {label}
            {type === 'textarea' ? (
              <textarea className="min-h-32 rounded-md border p-3 font-normal" value={form[name] || ''} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
            ) : (
              <input className="rounded-md border p-3 font-normal" value={form[name] || ''} onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
            )}
          </label>
        ))}
      </div>
      <button className="btn-primary mt-6" type="submit">Salvar</button>
    </form>
  );
}
