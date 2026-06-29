import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { DONATION_URL, externalHref, findExternalLink, whatsappLink } from '../api';

export default function Doacao() {
  const { config, linksExternos = [] } = useOutletContext();
  const donation = findExternalLink(linksExternos, 'Doação');
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');
  const donationHref = externalHref(donation, DONATION_URL);

  return (
    <div>
      <section className="bg-white">
        <div className="section grid items-start gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <SectionHeader eyebrow="Doação" title="Sua contribuição ajuda a manter o cuidado acontecendo">
              Doe com segurança pela plataforma oficial e fortaleça os projetos sociais da Ação Social Paroquial São João Batista.
            </SectionHeader>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <ImpactCard color="blue" title="Projeto Santa Dulce" text="Mantém crianças em ambiente seguro, educativo e acolhedor." />
              <ImpactCard color="green" title="Campanhas solidárias" text="Cestas básicas, fraldas e enxovais para famílias vulneráveis." />
              <ImpactCard color="coral" title="Bazares e eventos" text="Arrecadação para manter projetos em funcionamento." />
              <ImpactCard color="warm" title="49 anos de história" text="Uma comunidade unida há quase cinco décadas." />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn-cta" href={donationHref} target="_blank" rel="noopener noreferrer">
                Doar agora
              </a>
              <a
                className="btn-secondary"
                href={externalHref(whatsapp, whatsappLink(config?.whatsapp, 'Olá! Gostaria de saber mais sobre as formas de doação.'))}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tirar dúvida pelo WhatsApp
              </a>
            </div>
          </div>

          <div className="card p-7">
            <span className="eyebrow mb-4 inline-flex">Destino seguro</span>
            <h2 className="text-xl font-bold text-asp-ink">Você será direcionado para a página oficial de doação.</h2>
            <p className="mt-4 leading-7 text-asp-muted">
              O processamento da contribuição acontece fora deste site, em uma plataforma própria para doações online, com segurança e transparência.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-asp-muted">
              <li className="flex items-center gap-2">
                <span className="h-4 w-4 shrink-0 rounded-full bg-asp-green-light text-asp-green flex items-center justify-center text-xs font-bold">✓</span>
                Plataforma oficial
              </li>
              <li className="flex items-center gap-2">
                <span className="h-4 w-4 shrink-0 rounded-full bg-asp-green-light text-asp-green flex items-center justify-center text-xs font-bold">✓</span>
                Processamento seguro
              </li>
              <li className="flex items-center gap-2">
                <span className="h-4 w-4 shrink-0 rounded-full bg-asp-green-light text-asp-green flex items-center justify-center text-xs font-bold">✓</span>
                Comprovante emitido
              </li>
            </ul>
            <a className="btn-cta mt-6 w-full justify-center" href={donationHref} target="_blank" rel="noopener noreferrer">
              Acessar página de doação
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ImpactCard({ color, title, text }) {
  const colors = {
    blue: 'bg-asp-sky text-asp-blue',
    green: 'bg-asp-green-light text-asp-green',
    coral: 'bg-asp-coral-light text-asp-coral',
    warm: 'bg-asp-yellow text-asp-ink',
  };
  return (
    <div className={`rounded-2xl p-4 ${colors[color] || colors.blue}`}>
      <h3 className="font-bold text-sm">{title}</h3>
      <p className="mt-1 text-xs leading-5 opacity-80">{text}</p>
    </div>
  );
}
