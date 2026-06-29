import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';
import { externalHref, findExternalLink, whatsappLink } from '../api';

export default function Parceiros() {
  const { config, linksExternos = [] } = useOutletContext();
  const { parceiros = [] } = useSiteData();
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');

  return (
    <div>
      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Parceiros" title="Apoiadores que fortalecem a missão">
            ASA, Cáritas Brasil e empresas parceiras compõem uma rede essencial para ampliar o alcance das ações.
          </SectionHeader>

          <div className="grid gap-5 md:grid-cols-3">
            {parceiros.map((item) => (
              <article key={item.id} className="card p-6">
                {item.logo_url ? (
                  <img
                    src={item.logo_url}
                    alt={item.nome}
                    className="mb-4 h-20 max-w-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="mb-4 flex h-16 items-center justify-center rounded-xl bg-asp-sky">
                    <span className="text-xl font-bold text-asp-blue">{item.nome?.charAt(0)}</span>
                  </div>
                )}
                <h3 className="font-bold text-asp-ink">{item.nome}</h3>
                {item.descricao && (
                  <p className="mt-2 text-sm leading-7 text-asp-muted">{item.descricao}</p>
                )}
                {item.site_url && (
                  <a
                    className="mt-4 inline-block text-sm font-bold text-asp-blue hover:text-asp-blue-dark"
                    href={item.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visitar site →
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-asp-soft">
        <div className="section">
          <div className="card p-8">
            <span className="eyebrow mb-4 inline-flex">Seja parceiro</span>
            <h2 className="text-2xl font-bold text-asp-ink">Empresas podem apoiar projetos, eventos e necessidades pontuais.</h2>
            <p className="mt-3 text-asp-muted">Entre em contato e conheça as formas de parceria disponíveis.</p>
            <a
              className="btn-primary mt-6 inline-flex"
              href={externalHref(whatsapp, whatsappLink(config?.whatsapp, 'Olá! Minha empresa gostaria de apoiar a ONG.'))}
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar sobre parceria
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
