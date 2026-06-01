import { useOutletContext } from 'react-router-dom';
import DataCard from '../components/DataCard';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';
import { whatsappLink } from '../api';

export default function Campanhas() {
  const { config } = useOutletContext();
  const { campanhas = [] } = useSiteData();

  return (
    <main className="section">
      <SectionHeader eyebrow="Campanhas e metas" title="Ajuda organizada, sem pagamento online pelo site">
        Cada campanha apresenta a necessidade atual e direciona o visitante para contato pelo WhatsApp. A instituição combina as formas de apoio diretamente com cada pessoa ou empresa.
      </SectionHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campanhas.map((item) => (
          <div key={item.id} className="flex h-full flex-col">
            <DataCard item={item} type="campanha" />
            <a className="btn-primary mt-4 w-full" href={whatsappLink(config?.whatsapp, `Olá! Quero ajudar na campanha: ${item.titulo}`)} target="_blank" rel="noreferrer">Quero ajudar pelo WhatsApp</a>
          </div>
        ))}
      </div>
    </main>
  );
}
