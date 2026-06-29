import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { externalHref, findExternalLink, whatsappLink } from '../api';

export default function Contato() {
  const { config, linksExternos = [] } = useOutletContext();
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');
  const socialLinks = linksExternos.filter((link) => ['Instagram', 'Facebook', 'YouTube', 'Site externo', 'Doação'].includes(link.plataforma));
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div>
      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Contato" title="Fale com a Ação Social Paroquial São João Batista">
            Use os canais oficiais para conversar com a equipe e combinar formas responsáveis de apoio.
          </SectionHeader>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Informações de contato */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-asp-ink">Canais de atendimento</h2>
                <dl className="mt-4 space-y-3">
                  {config?.whatsapp && (
                    <ContactItem label="WhatsApp" value={config.whatsapp} />
                  )}
                  {config?.email && (
                    <ContactItem label="E-mail" value={config.email} />
                  )}
                  {config?.endereco && (
                    <ContactItem label="Endereço" value={config.endereco} />
                  )}
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    className="btn-primary"
                    href={externalHref(whatsapp, whatsappLink(config?.whatsapp))}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Falar pelo WhatsApp
                  </a>
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      className="btn-secondary"
                      href={link.url}
                      target={Number(link.nova_aba) ? '_blank' : undefined}
                      rel={Number(link.nova_aba) ? 'noopener noreferrer' : undefined}
                    >
                      {link.nome}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-asp-ink mb-5">Registrar interesse</h2>

              {submitted ? (
                <div className="rounded-xl bg-asp-green-light p-6 text-center">
                  <div className="text-2xl mb-2">✓</div>
                  <p className="font-bold text-asp-green">Mensagem registrada!</p>
                  <p className="mt-2 text-sm text-asp-muted">Para contato real, utilize os canais oficiais acima.</p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary mt-4 text-sm"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label htmlFor="contato-nome" className="form-label">
                      Nome <span className="text-asp-coral" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contato-nome"
                      type="text"
                      className="form-input"
                      placeholder="Seu nome completo"
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contato-email" className="form-label">
                      E-mail <span className="text-asp-coral" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contato-email"
                      type="email"
                      className="form-input"
                      placeholder="seu@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="contato-telefone" className="form-label">
                      Telefone
                    </label>
                    <input
                      id="contato-telefone"
                      type="tel"
                      className="form-input"
                      placeholder="(47) 9 0000-0000"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label htmlFor="contato-mensagem" className="form-label">
                      Mensagem <span className="text-asp-coral" aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contato-mensagem"
                      className="form-input min-h-32 resize-y"
                      placeholder="Como podemos ajudar?"
                      required
                    />
                  </div>
                  <p className="text-xs text-asp-muted">
                    Campos marcados com <span className="text-asp-coral">*</span> são obrigatórios. Este formulário registra a intenção. Para contato imediato, use os canais oficiais.
                  </p>
                  <button className="btn-primary w-full justify-center" type="submit">
                    Registrar interesse
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-asp-blue">{label}</dt>
      <dd className="mt-0.5 text-asp-ink">{value}</dd>
    </div>
  );
}
