import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';
import { externalHref, findExternalLink, whatsappLink } from '../api';

export default function SantaDulce() {
  const { config, linksExternos = [] } = useOutletContext();
  const data = useSiteData();
  const fotos = (data.galeria || []).filter((foto) => String(foto.categoria).toLowerCase().includes('dulce'));
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');

  return (
    <div>
      {/* Hero do projeto */}
      <section className="bg-white">
        <div className="section grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Projeto prioritário" title="Casa de Contraturno Escolar Santa Dulce dos Pobres">
              Um espaço de cuidado, educação, convivência e proteção para crianças no período oposto ao escolar.
            </SectionHeader>
            <a
              className="btn-primary"
              href={externalHref(whatsapp, whatsappLink(config?.whatsapp, 'Olá! Gostaria de apoiar o Projeto Santa Dulce dos Pobres.'))}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar sobre apoio
            </a>
          </div>
          <img
            className="h-96 w-full rounded-2xl border-4 border-asp-sky-mid object-cover shadow-soft"
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=80"
            alt="Crianças em atividade educativa no Projeto Santa Dulce dos Pobres"
            loading="eager"
          />
        </div>
      </section>

      {/* Caixas de info */}
      <section className="bg-asp-soft">
        <div className="section grid gap-6 md:grid-cols-3">
          <Box
            title="Objetivo"
            text="Oferecer ambiente seguro, educativo e acolhedor para fortalecer o desenvolvimento integral das crianças."
            color="blue"
          />
          <Box
            title="Necessidade atual"
            text="Ampliar rede de apoiadores, materiais, voluntários e parcerias para manter a estrutura de atendimento."
            color="warm"
          />
          <Box
            title="Formas de apoio"
            text="Contato institucional pelo WhatsApp para combinar doações de itens, parcerias, serviços ou participação."
            color="green"
          />
        </div>
      </section>

      {/* Galeria */}
      {(fotos.length > 0 || (data.galeria || []).length > 0) && (
        <section className="bg-white">
          <div className="section">
            <h2 className="mb-6 text-2xl font-bold text-asp-ink">Fotos do projeto</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {(fotos.length ? fotos : data.galeria || []).slice(0, 4).map((foto) => (
                <img
                  key={foto.id}
                  src={foto.imagem_url}
                  alt={foto.titulo}
                  className="h-72 w-full rounded-2xl object-cover shadow-card"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Box({ title, text, color }) {
  const colors = {
    blue: 'text-asp-blue bg-asp-sky',
    green: 'text-asp-green bg-asp-green-light',
    warm: 'text-asp-coral bg-asp-coral-light',
  };
  return (
    <div className="card p-6">
      <div className={`mb-3 inline-flex rounded-xl px-3 py-1.5 text-sm font-bold ${colors[color] || colors.blue}`}>
        {title}
      </div>
      <p className="leading-7 text-asp-muted">{text}</p>
    </div>
  );
}
