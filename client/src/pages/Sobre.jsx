import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import { hasValidCnpj } from '../api';
import useSiteData from './useSiteData';

export default function Sobre() {
  const data = useSiteData();
  const config = data.configuracoes || {};
  const showCnpj = hasValidCnpj(config.cnpj);

  return (
    <div>
      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Sobre nós" title="Uma história de presença social ligada à comunidade">
            A Ação Social Paroquial São João Batista atua em Itajaí/SC há 49 anos, aproximando pessoas, famílias, voluntários e parceiros em torno do cuidado com quem mais precisa.
          </SectionHeader>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr]">
            <div className="space-y-5 text-lg leading-8 text-asp-muted">
              <p>
                A instituição nasceu da mobilização comunitária da Paróquia São João Batista e segue como ponto de apoio para famílias em situação de vulnerabilidade social.
              </p>
              <p>
                Uma das principais frentes é a Casa de Contraturno Escolar Santa Dulce dos Pobres, dedicada ao cuidado, convivência e apoio educativo de crianças no período oposto ao escolar.
              </p>
              <p>
                O trabalho também envolve bazares solidários, campanhas de cestas básicas, fraldas e enxovais, além de eventos beneficentes que ajudam a manter as ações em funcionamento.
              </p>
              <Link className="btn-primary inline-flex" to="/projetos">
                Conheça os Projetos
              </Link>
            </div>

            <div className="card p-7">
              <h2 className="text-lg font-bold text-asp-ink">Informações principais</h2>
              <dl className="mt-5 space-y-4 text-sm">
                {showCnpj && <Info label="CNPJ" value={config.cnpj} />}
                <Info label="Localização" value="Itajaí/SC" />
                <Info label="Anos de atuação" value="49 anos de trabalho social comunitário" />
                <Info label="Projeto principal" value="Casa de Contraturno Escolar Santa Dulce dos Pobres" />
                <Info label="Formas de apoio" value="Doação online, bazares, campanhas, eventos e parcerias" />
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-asp-soft">
        <div className="section pt-0">
          <div className="grid gap-5 md:grid-cols-3">
            <Value
              title="Cuidado com crianças"
              text="O Projeto Santa Dulce fortalece rotina, convivência e acompanhamento no contraturno escolar."
              color="blue"
            />
            <Value
              title="Apoio às famílias"
              text="As campanhas ajudam a atender necessidades urgentes com alimentos, fraldas, enxovais e orientação."
              color="green"
            />
            <Value
              title="Comunidade mobilizada"
              text="Bazares, eventos e parcerias aproximam quem deseja ajudar de ações concretas."
              color="warm"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-asp-blue">{label}</dt>
      <dd className="mt-0.5 text-asp-ink">{value}</dd>
    </div>
  );
}

function Value({ title, text, color }) {
  const accent = {
    blue: 'text-asp-blue',
    green: 'text-asp-green',
    warm: 'text-asp-coral',
  };
  return (
    <div className="card p-6">
      <h3 className={`font-bold ${accent[color] || accent.blue}`}>{title}</h3>
      <p className="mt-2 leading-7 text-asp-muted">{text}</p>
    </div>
  );
}
