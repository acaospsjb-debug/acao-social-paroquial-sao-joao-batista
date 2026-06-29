import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';
import { externalHref, findExternalLink, whatsappLink } from '../api';

export default function Parceiros() {
  const { config, linksExternos = [] } = useOutletContext();
  const { parceiros = [] } = useSiteData();
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');

  return (
    <main className="section">
      <SectionHeader eyebrow="Parceiros" title="Apoiadores que fortalecem a missão">
        ASA, Cáritas Brasil e empresas parceiras compõem uma rede essencial para ampliar o alcance das ações.
      </SectionHeader>
      <div className="grid gap-5 md:grid-cols-3">
        {parceiros.map((item) => (
          <article key={item.id} className="card p-6">
            {item.logo_url ? <img src={item.logo_url} alt={item.nome} className="mb-4 h-20 max-w-full object-contain" /> : <div className="mb-4 rounded-md bg-asp-soft p-4 text-center font-bold text-asp-green">Logo</div>}
            <h3 className="font-bold text-asp-ink">{item.nome}</h3>
            <p className="mt-2 leading-7 text-slate-600">{item.descricao}</p>
            {item.site_url && <a className="mt-4 inline-block text-sm font-bold text-asp-green" href={item.site_url} target="_blank" rel="noopener noreferrer">Visitar site</a>}
          </article>
        ))}
      </div>
      <div className="mt-10 rounded-lg bg-asp-soft p-8">
        <h2 className="text-2xl font-bold text-asp-ink">Empresas podem apoiar projetos, eventos e necessidades pontuais.</h2>
        <a className="btn-primary mt-5" href={externalHref(whatsapp, whatsappLink(config?.whatsapp, 'Olá! Minha empresa gostaria de apoiar a ONG.'))} target="_blank" rel="noopener noreferrer">Falar sobre parceria</a>
      </div>
    </main>
  );
}
