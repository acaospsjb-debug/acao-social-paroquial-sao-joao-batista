import { useOutletContext } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { externalHref, findExternalLink, hasValidCnpj, whatsappLink } from '../api';

export default function Transparencia() {
  const { config, linksExternos = [] } = useOutletContext();
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');
  const showCnpj = hasValidCnpj(config?.cnpj);

  return (
    <div>
      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Transparência" title="Prestação de contas e documentos">
            A Ação Social Paroquial São João Batista mantém o compromisso com a transparência de suas
            atividades, recursos e impacto social.
          </SectionHeader>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {showCnpj && (
              <article className="card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-asp-sky">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-asp-blue" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
                  </svg>
                </div>
                <h3 className="font-bold text-asp-ink">Dados institucionais</h3>
                <div className="mt-3 space-y-1 text-sm text-asp-muted">
                  <p><span className="font-medium text-asp-ink">CNPJ:</span> {config.cnpj}</p>
                  {config?.nome && <p><span className="font-medium text-asp-ink">Razão social:</span> {config.nome}</p>}
                  {config?.endereco && <p><span className="font-medium text-asp-ink">Endereço:</span> {config.endereco}</p>}
                </div>
              </article>
            )}

            <article className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-asp-sky">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-asp-blue" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="font-bold text-asp-ink">Entidade sem fins lucrativos</h3>
              <p className="mt-3 text-sm leading-relaxed text-asp-muted">
                Somos uma organização da sociedade civil, registrada e atuante há 49 anos em Itajaí/SC.
                Nossos recursos são integralmente destinados à assistência social de famílias em situação de vulnerabilidade.
              </p>
            </article>

            <article className="card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-asp-sky">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-asp-blue" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 className="font-bold text-asp-ink">Documentos e relatórios</h3>
              <p className="mt-3 text-sm leading-relaxed text-asp-muted">
                Estatuto social, atas de reunião e relatórios de atividades disponíveis mediante solicitação.
                Entre em contato para solicitar documentação institucional.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-asp-soft">
        <div className="section">
          <div className="card p-8">
            <span className="eyebrow mb-4 inline-flex">Solicitar documentos</span>
            <h2 className="text-2xl font-bold text-asp-ink">Precisa de informações institucionais?</h2>
            <p className="mt-3 text-asp-muted">
              Entre em contato via WhatsApp para solicitar relatórios, estatutos ou outros documentos da ONG.
            </p>
            <a
              className="btn-primary mt-6 inline-flex"
              href={externalHref(whatsapp, whatsappLink(config?.whatsapp, 'Olá! Gostaria de solicitar documentos institucionais da ONG.'))}
              target="_blank"
              rel="noopener noreferrer"
            >
              Solicitar pelo WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
