import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';

export default function Transparencia() {
  const { configuracoes = {}, documentos = [] } = useSiteData();

  return (
    <main className="section">
      <SectionHeader eyebrow="Transparência" title="Documentos institucionais e prestação de contas">
        Esta área organiza CNPJ, estatuto, relatórios bimestrais, prestação de contas e dados institucionais.
      </SectionHeader>
      <div className="card mb-8 p-6">
        <h2 className="text-xl font-bold">Dados institucionais</h2>
        <p className="mt-3 text-slate-600">CNPJ: {configuracoes.cnpj}</p>
        <p className="text-slate-600">Endereço: {configuracoes.endereco}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {documentos.map((doc) => (
          <article key={doc.id} className="card p-6">
            <p className="text-sm font-bold uppercase text-asp-green">{doc.tipo}</p>
            <h3 className="mt-2 text-xl font-bold">{doc.nome}</h3>
            <p className="mt-2 leading-7 text-slate-600">{doc.descricao}</p>
            <a className="btn-secondary mt-4" href={doc.link_url} target="_blank" rel="noreferrer">Ver documento</a>
          </article>
        ))}
      </div>
    </main>
  );
}
