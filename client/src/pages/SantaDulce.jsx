import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';
import { whatsappLink } from '../api';

export default function SantaDulce() {
  const { config } = useOutletContext();
  const data = useSiteData();
  const fotos = (data.galeria || []).filter((foto) => String(foto.categoria).toLowerCase().includes('dulce'));

  return (
    <main>
      <section className="bg-asp-soft">
        <div className="section grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Projeto prioritário" title="Casa de Contraturno Escolar Santa Dulce dos Pobres">
              Um espaço de cuidado, educação, convivência e proteção para crianças no período oposto ao escolar.
            </SectionHeader>
            <a className="btn-primary" href={whatsappLink(config?.whatsapp, 'Olá! Gostaria de apoiar o Projeto Santa Dulce dos Pobres.')} target="_blank" rel="noreferrer">Falar sobre apoio</a>
          </div>
          <img className="h-96 w-full rounded-lg object-cover shadow-soft" src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80" alt="Crianças em atividade educativa" />
        </div>
      </section>
      <section className="section grid gap-6 md:grid-cols-3">
        <Box title="Objetivo" text="Oferecer ambiente seguro, educativo e acolhedor para fortalecer o desenvolvimento integral das crianças." />
        <Box title="Necessidade atual" text="Ampliar rede de apoiadores, materiais, voluntários e parcerias para manter a estrutura de atendimento." />
        <Box title="Formas de apoio" text="Contato institucional pelo WhatsApp para combinar doações de itens, parcerias, serviços ou participação em campanhas." />
      </section>
      <section className="section pt-0">
        <h2 className="mb-5 text-2xl font-bold">Fotos do projeto</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {(fotos.length ? fotos : data.galeria || []).slice(0, 4).map((foto) => (
            <img key={foto.id} src={foto.imagem_url} alt={foto.titulo} className="h-72 w-full rounded-lg object-cover shadow-soft" />
          ))}
        </div>
      </section>
    </main>
  );
}

function Box({ title, text }) {
  return <div className="card p-6"><h2 className="text-xl font-bold text-asp-green">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></div>;
}
