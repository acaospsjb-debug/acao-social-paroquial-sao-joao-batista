import DataCard from '../components/DataCard';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';


export default function Projetos() {
  const { projetos = [] } = useSiteData();

  return (
    <div>
      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Projetos e ações" title="Frentes que unem acolhimento e mobilização comunitária">
            Conheça as ações permanentes e iniciativas sociais da Ação Social Paroquial São João Batista.
          </SectionHeader>

          {projetos.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projetos.map((item) => <DataCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
