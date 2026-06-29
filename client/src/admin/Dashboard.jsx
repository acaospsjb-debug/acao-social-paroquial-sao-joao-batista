import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api('/api/admin/dashboard').then(setData).catch(() => {});
  }, []);

  const cards = [
    ['Fotos Santa Dulce', data?.galeria],
    ['Projetos', data?.projetos],
    ['Links externos', data?.linksExternos],
    ['Documentos', data?.documentos],
    ['Parceiros', data?.parceiros],
    ['Notícias/eventos', data?.noticiasEventos]
  ];

  return (
    <>
      <h1 className="text-3xl font-bold">Resumo</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <div className="card p-6" key={label}>
            <p className="text-sm font-bold uppercase text-slate-500">{label}</p>
            <strong className="mt-2 block text-4xl text-asp-green">{value ?? '-'}</strong>
          </div>
        ))}
      </div>
    </>
  );
}
