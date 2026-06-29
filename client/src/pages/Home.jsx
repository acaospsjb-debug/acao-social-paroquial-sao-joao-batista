import { Link, useOutletContext } from 'react-router-dom';
import DataCard from '../components/DataCard';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';
import { externalHref, findExternalLink, whatsappLink } from '../api';

const fallbackHero = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80';

export default function Home() {
  const { config, linksExternos = [], visiblePages = {} } = useOutletContext();
  const data = useSiteData();
  const projetos = data.projetos || [];
  const parceiros = data.parceiros || [];
  const whatsapp = findExternalLink(linksExternos, 'WhatsApp');

  return (
    <>
      <section className="bg-asp-soft">
        <div className="section grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 font-bold uppercase tracking-wide text-asp-green">Projeto Santa Dulce dos Pobres</p>
            <h1 className="text-4xl font-bold leading-tight text-asp-ink md:text-6xl">
              Uma extensão dos braços de quem deseja ajudar.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A Ação Social Paroquial São João Batista atua há 49 anos em Itajaí/SC, acolhendo famílias em vulnerabilidade social com presença, cuidado e responsabilidade.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn-primary" href={externalHref(whatsapp, whatsappLink(config?.whatsapp))} target="_blank" rel="noopener noreferrer">Falar pelo WhatsApp</a>
              {visiblePages.santa_dulce && <Link className="btn-secondary" to="/projeto-santa-dulce">Conhecer o projeto</Link>}
            </div>
          </div>
          <HeroMedia videoUrl={config?.hero_video_url} posterUrl={config?.hero_video_poster_url} />
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Institucional" title="Acolhimento, transparência e compromisso comunitário">
          {config?.texto_institucional}
        </SectionHeader>
        <div className="grid gap-5 md:grid-cols-3">
          <Metric value="49 anos" label="de atuação em Itajaí/SC" />
          <Metric value="Projetos sociais" label="para crianças, famílias e comunidade" />
          <Metric value="Rede de apoio" label="com parceiros, voluntários e empresas" />
        </div>
      </section>

      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Projetos" title="Principais frentes de atuação" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projetos.slice(0, 3).map((item) => <DataCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      <section className="bg-asp-soft">
        <div className="section">
          <SectionHeader eyebrow="Parceiros" title="Uma rede de confiança sustenta esta missão" />
          <div className="grid gap-4 md:grid-cols-3">
            {parceiros.slice(0, 3).map((item) => (
              <div key={item.id} className="card p-6">
                <h3 className="font-bold text-asp-ink">{item.nome}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.descricao}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-lg bg-asp-ink p-8 text-white">
            <h2 className="text-2xl font-bold">Sua empresa também pode apoiar esta causa.</h2>
            <p className="mt-3 text-slate-200">Entre em contato para conhecer projetos, necessidades atuais e formas responsáveis de apoio.</p>
            <a className="btn-primary mt-6" href={externalHref(whatsapp, whatsappLink(config?.whatsapp))} target="_blank" rel="noopener noreferrer">Quero conversar com a ONG</a>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroMedia({ videoUrl, posterUrl }) {
  const embed = buildEmbedUrl(videoUrl);
  const isMp4 = /\.mp4($|\?)/i.test(videoUrl || '');

  if (embed) {
    return (
      <div className="overflow-hidden rounded-lg border border-white/80 bg-white shadow-soft">
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
      <video className="aspect-video w-full rounded-lg bg-asp-ink object-cover shadow-soft" src={videoUrl} poster={posterUrl || fallbackHero} controls playsInline preload="metadata">
        Seu navegador não suporta vídeo HTML5.
      </video>
    );
  }

  return <img className="h-[420px] w-full rounded-lg object-cover shadow-soft" src={posterUrl || fallbackHero} alt="Voluntários em ação social" />;
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

function Metric({ value, label }) {
  return (
    <div className="card p-6">
      <strong className="text-3xl text-asp-green">{value}</strong>
      <p className="mt-2 text-slate-600">{label}</p>
    </div>
  );
}
