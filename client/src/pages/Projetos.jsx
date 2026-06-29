import DataCard from '../components/DataCard';
import SectionHeader from '../components/SectionHeader';
import useSiteData from './useSiteData';

const ACOES_COMPLEMENTARES = [
  { nome: 'Bazares Solidários', descricao: 'Venda de itens doados para arrecadar fundos e apoiar as famílias atendidas.' },
  { nome: 'Apoio com fraldas', descricao: 'Distribuição de fraldas para famílias com bebês em situação de vulnerabilidade.' },
  { nome: 'Enxovais solidários', descricao: 'Kits de roupas e itens essenciais para recém-nascidos de famílias carentes.' },
  { nome: 'Festa das Crianças', descricao: 'Celebração anual com recreação, brindes e momentos especiais para as crianças.' },
  { nome: 'Festas de Natal', descricao: 'Ação de fim de ano que distribui presentes e promove confraternização.' },
  { nome: 'Café Colonial temático', descricao: 'Evento beneficente que arrecada recursos e aproxima a comunidade.' },
];

export default function Projetos() {
  const { projetos = [] } = useSiteData();

  return (
    <div>
      <section className="bg-white">
        <div className="section">
          <SectionHeader eyebrow="Projetos e ações" title="Frentes que unem acolhimento e mobilização comunitária">
            Conheça as ações permanentes e iniciativas sociais da Ação Social Paroquial São João Batista.
          </SectionHeader>

          {projetos.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projetos.map((item) => <DataCard key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </section>

      <section className="bg-asp-soft">
        <div className="section">
          <SectionHeader eyebrow="Ações comunitárias" title="Iniciativas que mobilizam a comunidade" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {ACOES_COMPLEMENTARES.map((acao) => (
              <article key={acao.nome} className="card p-6">
                <h3 className="font-bold text-asp-ink">{acao.nome}</h3>
                <p className="mt-2 text-sm leading-7 text-asp-muted">{acao.descricao}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
