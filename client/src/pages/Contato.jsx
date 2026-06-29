import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { externalHref, findExternalLink, whatsappLink } from '../api';

export default function Contato() {
  const { config, linksExternos = [] } = useOutletContext();
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');
  const socialLinks = linksExternos.filter((link) => ['Instagram', 'Facebook', 'YouTube', 'Site externo', 'Doação'].includes(link.plataforma));

  return (
    <main className="section">
      <SectionHeader eyebrow="Contato" title="Fale com a Ação Social Paroquial São João Batista">
        Use os canais oficiais para conversar com a equipe e combinar formas responsáveis de apoio.
      </SectionHeader>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-asp-ink">Canais</h2>
          <p className="mt-4 text-slate-600">WhatsApp: {config?.whatsapp}</p>
          <p className="text-slate-600">E-mail: {config?.email}</p>
          <p className="text-slate-600">Endereço: {config?.endereco}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn-primary" href={externalHref(whatsapp, whatsappLink(config?.whatsapp))} target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp</a>
            {socialLinks.map((link) => (
              <a key={link.id} className="btn-secondary" href={link.url} target={Number(link.nova_aba) ? '_blank' : undefined} rel={Number(link.nova_aba) ? 'noopener noreferrer' : undefined}>
                {link.nome}
              </a>
            ))}
          </div>
        </div>
        <form className="card grid gap-4 p-6" onSubmit={(event) => event.preventDefault()}>
          <input className="rounded-md border border-slate-200 p-3" placeholder="Nome" />
          <input className="rounded-md border border-slate-200 p-3" placeholder="E-mail" />
          <input className="rounded-md border border-slate-200 p-3" placeholder="Telefone" />
          <textarea className="min-h-32 rounded-md border border-slate-200 p-3" placeholder="Mensagem" />
          <button className="btn-secondary" type="submit">Registrar interesse</button>
          <p className="text-sm text-slate-500">Este formulário registra apenas a intenção visualmente. Para contato real, use os canais oficiais.</p>
        </form>
      </div>
    </main>
  );
}
