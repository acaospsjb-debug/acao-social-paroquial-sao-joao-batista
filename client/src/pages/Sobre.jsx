import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';

export default function Sobre() {
  const data = useSiteData();
  const config = data.configuracoes || {};

  return (
    <main className="section">
      <SectionHeader eyebrow="Sobre a ONG" title="49 anos de presença social em Itajaí/SC">
        A instituição nasceu da mobilização comunitária e segue atuando para que famílias em vulnerabilidade encontrem orientação, acolhimento e apoio concreto.
      </SectionHeader>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-5 text-lg leading-8 text-slate-600">
          <p>{config.texto_institucional}</p>
          <p>O trabalho é realizado com linguagem humana, responsabilidade institucional e compromisso com a transparência. O site reúne uma estrutura para apresentar documentos, fotos das ações, relatórios e dados de atendimento.</p>
          <p>Relatos de famílias devem ser publicados apenas com consentimento. Neste MVP, o espaço institucional foi preparado sem expor nomes reais.</p>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-bold">Dados de credibilidade</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-600">
            <Info label="CNPJ" value={config.cnpj} />
            <Info label="Estatuto" value="Disponível na área de transparência" />
            <Info label="Prestação de contas" value="Estrutura preparada para relatórios" />
            <Info label="Fotos das ações" value="Galeria administrável por URL" />
            <Info label="Famílias atendidas" value="Campo a evoluir com dados consolidados" />
          </dl>
        </div>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Value title="Missão" text="Acolher e apoiar famílias em vulnerabilidade social, fortalecendo vínculos e dignidade." />
        <Value title="Visão" text="Ser referência comunitária em cuidado social transparente e responsável." />
        <Value title="Valores" text="Solidariedade, ética, respeito, escuta, transparência e compromisso." />
      </div>
    </main>
  );
}

function Info({ label, value }) {
  return <div><dt className="font-bold text-asp-ink">{label}</dt><dd>{value}</dd></div>;
}

function Value({ title, text }) {
  return <div className="card p-6"><h3 className="font-bold text-asp-green">{title}</h3><p className="mt-2 leading-7 text-slate-600">{text}</p></div>;
}
