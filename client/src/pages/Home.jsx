import { Link, useOutletContext } from 'react-router-dom';
import DataCard from '../components/DataCard';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';
import { DONATION_URL, externalHref, findExternalLink, whatsappLink } from '../api';

const fallbackHero = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80';

export default function Home() {
  const { config, linksExternos = [], visiblePages = {} } = useOutletContext();
  const data = useSiteData();
  const projetos = data.projetos || [];
  const parceiros = data.parceiros || [];
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');
  const donation = findExternalLink(linksExternos, 'Doação');

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-asp-blue-dark">
        {/* Círculos decorativos de fundo */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full bg-asp-blue/40" aria-hidden="true" />

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:px-8 lg:py-28">
          {/* Texto */}
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 border border-white/15">
              Projeto Santa Dulce dos Pobres
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
              Transformando solidariedade em{' '}
              <span className="text-asp-warm">cuidado e esperança.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
              A Ação Social Paroquial São João Batista atua há 49 anos em Itajaí/SC, acolhendo famílias em vulnerabilidade social com presença, cuidado e responsabilidade.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {visiblePages.projetos && (
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-asp-warm px-6 py-2.5 text-sm font-bold text-asp-ink shadow-cta transition hover:bg-asp-warm-dark"
                  to="/projetos"
                >
                  Conheça nossos projetos
                </Link>
              )}
              {visiblePages.doacao && (
                <Link
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 hover:border-white/70"
                  to="/doacao"
                >
                  Como ajudar
                </Link>
              )}
            </div>
            {/* Credibilidade rápida */}
            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8 text-sm text-white/60">
              <span><strong className="text-white">49 anos</strong> de atuação</span>
              <span><strong className="text-white">100+</strong> famílias atendidas</span>
              <span><strong className="text-white">Itajaí/SC</strong></span>
            </div>
          </div>

          {/* Vídeo ou imagem em moldura */}
          <HeroMedia videoUrl={config?.hero_video_url} posterUrl={config?.hero_video_poster_url} />
        </div>
      </section>

      {/* ── Sobre a instituição ── */}
      <section className="bg-asp-soft">
        <div className="section grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeader eyebrow="Quem somos" title="Uma história de 49 anos a serviço da comunidade">
              {config?.texto_institucional ||
                'Nascida da mobilização comunitária da Paróquia São João Batista, a instituição é ponto de apoio para crianças e famílias em situação de vulnerabilidade social em Itajaí/SC.'}
            </SectionHeader>
            {visiblePages.sobre && (
              <Link className="btn-secondary" to="/sobre">Conheça nossa história</Link>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatBox number="49" label="Anos de atuação" color="blue" />
            <StatBox number="100+" label="Famílias atendidas" color="green" />
            <StatBox number="3+" label="Projetos sociais ativos" color="coral" />
            <StatBox number="Itajaí" label="Nossa comunidade" color="warm" />
          </div>
        </div>
      </section>

      {/* ── Destaque: Santa Dulce ── */}
      {visiblePages.santa_dulce && (
        <section className="bg-white">
          <div className="section grid items-center gap-10 lg:grid-cols-2">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
              alt="Crianças participando de atividade educativa no Projeto Santa Dulce dos Pobres"
              className="h-80 w-full rounded-2xl object-cover shadow-soft order-2 lg:order-1"
              loading="lazy"
            />
            <div className="order-1 lg:order-2">
              <SectionHeader eyebrow="Projeto prioritário" title="Casa de Contraturno Escolar Santa Dulce dos Pobres">
                Um espaço de cuidado, educação, convivência e proteção para crianças no período oposto ao escolar.
              </SectionHeader>
              <ul className="mb-8 space-y-2 text-sm text-asp-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-asp-green-light text-asp-green flex items-center justify-center text-xs font-bold">✓</span>
                  Acompanhamento educativo e reforço escolar
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-asp-green-light text-asp-green flex items-center justify-center text-xs font-bold">✓</span>
                  Atividades lúdicas e socialização
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-asp-green-light text-asp-green flex items-center justify-center text-xs font-bold">✓</span>
                  Ambiente seguro e acolhedor
                </li>
              </ul>
              <Link className="btn-primary" to="/projetos">Conheça o projeto</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Projetos ── */}
      {projetos.length > 0 && (
        <section className="bg-asp-soft">
          <div className="section">
            <SectionHeader eyebrow="Projetos sociais" title="Principais frentes de atuação" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projetos.slice(0, 3).map((item) => <DataCard key={item.id} item={item} />)}
            </div>
            {visiblePages.projetos && (
              <div className="mt-8 text-center">
                <Link className="btn-secondary" to="/projetos">Ver todos os projetos</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Como ajudar ── */}
      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Como ajudar" title="Sua participação faz a diferença" centered>
            Existem várias formas de contribuir com a missão da Ação Social Paroquial São João Batista.
          </SectionHeader>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <HelpCard
              icon={<HeartIcon />}
              title="Faça uma doação"
              text="Contribua financeiramente para manter os projetos em funcionamento."
              action={visiblePages.doacao ? <Link className="btn-primary text-xs px-4 py-2" to="/doacao">Quero doar</Link> : null}
            />
            <HelpCard
              icon={<HandsIcon />}
              title="Seja voluntário"
              text="Participe com seu tempo e habilidades. Há espaço para todos."
              action={
                <a className="btn-secondary text-xs px-4 py-2" href={externalHref(whatsapp, whatsappLink(config?.whatsapp, 'Olá! Gostaria de ser voluntário.'))} target="_blank" rel="noopener noreferrer">
                  Seja voluntário
                </a>
              }
            />
            <HelpCard
              icon={<BuildingIcon />}
              title="Seja parceiro"
              text="Empresas e organizações podem apoiar projetos e campanhas."
              action={
                visiblePages.parceiros
                  ? <Link className="btn-secondary text-xs px-4 py-2" to="/parceiros">Quero ser parceiro</Link>
                  : null
              }
            />
            <HelpCard
              icon={<ShareIcon />}
              title="Divulgue"
              text="Compartilhe nossos projetos com amigos, familiares e redes."
              action={
                <a className="btn-secondary text-xs px-4 py-2" href={externalHref(whatsapp, whatsappLink(config?.whatsapp))} target="_blank" rel="noopener noreferrer">
                  Entre em contato
                </a>
              }
            />
          </div>
        </div>
      </section>

      {/* ── Parceiros ── */}
      {parceiros.length > 0 && (
        <section className="bg-asp-soft">
          <div className="section">
            <SectionHeader eyebrow="Parceiros" title="Uma rede de confiança sustenta esta missão" />
            <div className="grid gap-4 md:grid-cols-3">
              {parceiros.slice(0, 3).map((item) => (
                <div key={item.id} className="card p-6">
                  {item.logo_url && (
                    <img src={item.logo_url} alt={item.nome} className="mb-4 h-14 max-w-full object-contain" loading="lazy" />
                  )}
                  <h3 className="font-bold text-asp-ink">{item.nome}</h3>
                  {item.descricao && <p className="mt-2 text-sm leading-6 text-asp-muted">{item.descricao}</p>}
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-asp-border bg-white p-8 shadow-card">
              <h2 className="text-2xl font-bold text-asp-ink">Sua empresa também pode apoiar esta causa.</h2>
              <p className="mt-3 text-asp-muted">Entre em contato para conhecer projetos, necessidades atuais e formas responsáveis de apoio.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a className="btn-cta" href={externalHref(donation, DONATION_URL)} target="_blank" rel="noopener noreferrer">Doar agora</a>
                <a className="btn-secondary" href={externalHref(whatsapp, whatsappLink(config?.whatsapp))} target="_blank" rel="noopener noreferrer">Quero conversar com a instituição</a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function StatBox({ number, label, color }) {
  const colors = {
    blue: 'bg-asp-sky text-asp-blue',
    green: 'bg-asp-green-light text-asp-green',
    coral: 'bg-asp-coral-light text-asp-coral',
    warm: 'bg-asp-yellow text-asp-ink',
  };
  return (
    <div className={`rounded-2xl p-5 ${colors[color] || colors.blue}`}>
      <div className="text-3xl font-bold">{number}</div>
      <div className="mt-1 text-sm font-medium">{label}</div>
    </div>
  );
}

function HelpCard({ icon, title, text, action }) {
  return (
    <div className="card flex flex-col items-start gap-4 p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-asp-sky text-asp-blue">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-asp-ink">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-asp-muted">{text}</p>
      </div>
      {action && <div className="mt-auto pt-2">{action}</div>}
    </div>
  );
}

function HeroMedia({ videoUrl, posterUrl }) {
  const embed = buildEmbedUrl(videoUrl);
  const isMp4 = /\.mp4($|\?)/i.test(videoUrl || '');

  const frame = 'relative overflow-hidden rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-white/10';

  if (embed) {
    return (
      <div className={frame}>
        <iframe
          className="aspect-video w-full"
          src={embed}
          title="Vídeo institucional da Ação Social Paroquial São João Batista"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  if (isMp4) {
    return (
      <div className={frame}>
        <video
          className="aspect-video w-full object-cover"
          src={videoUrl}
          poster={posterUrl || fallbackHero}
          controls
          playsInline
          preload="metadata"
        >
          Seu navegador não suporta vídeo HTML5.
        </video>
      </div>
    );
  }

  return (
    <div className={frame}>
      <img
        className="aspect-video w-full object-cover"
        src={posterUrl || fallbackHero}
        alt="Voluntários em ação social comunitária"
        loading="eager"
      />
    </div>
  );
}

function buildEmbedUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : '';
    }
    if (parsed.hostname.includes('vimeo.com')) {
      const id = parsed.pathname.split('/').filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : '';
    }
  } catch (_error) {
    return '';
  }
  return '';
}

function HeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function HandsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
