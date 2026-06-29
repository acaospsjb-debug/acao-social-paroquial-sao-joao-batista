import DataCard from '../components/DataCard';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';

export default function Projetos() {
  const { projetos = [] } = useSiteData();
  const acoes = ['Bazares Solidários', 'Apoio com fraldas', 'Enxovais solidários', 'Festa das Crianças', 'Festas de Natal', 'Café Colonial temático'];

  return (
    <main className="section">
      <SectionHeader eyebrow="Projetos e ações" title="Frentes que unem acolhimento e mobilização comunitária">
        Conheça as ações permanentes e iniciativas sociais da Ação Social Paroquial São João Batista.
      </SectionHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projetos.map((item) => <DataCard key={item.id} item={item} />)}
        {acoes.map((acao) => (
          <article key={acao} className="card p-6">
            <h3 className="text-xl font-bold text-asp-ink">{acao}</h3>
            <p className="mt-3 leading-7 text-slate-600">Iniciativa preparada para mobilizar apoiadores e atender necessidades identificadas pela instituição.</p>
          </article>
        ))}
      </div>
    </main>
  );
}
