const bcrypt = require('bcryptjs');
const {
  User,
  Configuracao,
  Projeto,
  Campanha,
  Parceiro,
  NoticiaEvento,
  Galeria,
  LinkExterno
} = require('./models');

const DONATION_URL = 'https://acaosocialparoquialsjb.doardigital.com.br/doacao';

async function ensureInitialData() {
  await ensureAdmin();
  await ensureConfig();
  await seedIfEmpty(Projeto, projectRows);
  await seedIfEmpty(Campanha, campaignRows);
  await seedIfEmpty(Parceiro, partnerRows);
  await seedIfEmpty(NoticiaEvento, newsRows);
  await seedIfEmpty(Galeria, galleryRows);
  await ensureDonationLink();
  await updateSeededPublicText();
}

async function ensureAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL e ADMIN_PASSWORD devem ser definidos no .env.');
  }

  const senhaHash = await bcrypt.hash(adminPassword, 10);

  await User.findOneAndUpdate(
    { email: adminEmail },
    { nome: 'Administrador ASP', email: adminEmail, senha_hash: senhaHash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function ensureConfig() {
  const config = await Configuracao.findOne();
  if (config) {
    let changed = false;
    const defaults = defaultVisiblePages();
    if (!config.paginas_visiveis || config.paginas_visiveis.size === 0) {
      config.paginas_visiveis = defaults;
      changed = true;
    } else {
      Object.entries(defaults).forEach(([page, value]) => {
        if (config.paginas_visiveis.get(page) === undefined) {
          config.paginas_visiveis.set(page, value);
          changed = true;
        }
      });
    }
    if (changed) await config.save();
    return;
  }

  await Configuracao.create({
    nome: 'Ação Social Paroquial São João Batista',
    texto_institucional: 'Há 49 anos em Itajaí/SC, a Ação Social Paroquial São João Batista mantém ações de cuidado com crianças, apoio às famílias e mobilização comunitária por meio do Projeto Santa Dulce, bazares, campanhas e parcerias locais.',
    whatsapp: '5547999999999',
    email: 'contato@acaosocialsaojoao.org.br',
    endereco: 'Itajaí/SC - endereço institucional a confirmar',
    cnpj: '00.000.000/0001-00',
    hero_video_url: '',
    hero_video_poster_url: '',
    paginas_visiveis: defaultVisiblePages()
  });
}

function defaultVisiblePages() {
  return {
    inicio: 1,
    sobre: 1,
    santa_dulce: 1,
    projetos: 1,
    doacao: 1,
    parceiros: 1,
    noticias: 1,
    contato: 1
  };
}

async function seedIfEmpty(Model, rows) {
  const existing = await Model.countDocuments();
  if (existing > 0) return;
  await Model.insertMany(rows);
}

async function ensureDonationLink() {
  const existing = await LinkExterno.findOne({ plataforma: 'Doação' });
  if (existing) return;
  await LinkExterno.create({
    nome: 'Doação online',
    url: DONATION_URL,
    plataforma: 'Doação',
    ativo: 1,
    nova_aba: 1
  });
}

async function updateSeededPublicText() {
  await Configuracao.updateOne(
    { texto_institucional: 'Há 49 anos em Itajaí/SC, a Ação Social Paroquial São João Batista acolhe famílias em situação de vulnerabilidade social com escuta, apoio e projetos que fortalecem vínculos comunitários.' },
    { texto_institucional: 'Há 49 anos em Itajaí/SC, a Ação Social Paroquial São João Batista mantém ações de cuidado com crianças, apoio às famílias e mobilização comunitária por meio do Projeto Santa Dulce, bazares, campanhas e parcerias locais.' }
  );
  await Projeto.updateOne({ titulo: 'Campanhas de Cestas Básicas' }, { titulo: 'Apoio com Cestas Básicas' });
  await Projeto.updateOne({ titulo: 'Campanhas de Fraldas e Enxovais' }, { titulo: 'Apoio com Fraldas e Enxovais' });
  await Parceiro.updateOne(
    { nome: 'Empresas parceiras', descricao: 'Espaço aberto para empresas que desejam apoiar campanhas e projetos sociais.' },
    { descricao: 'Espaço aberto para empresas que desejam apoiar projetos sociais e necessidades comunitárias.' }
  );
  await NoticiaEvento.updateOne(
    { titulo: 'Festa das Crianças e Natal', conteudo: 'Campanhas sazonais com arrecadação de brinquedos, alimentos e itens de apoio.' },
    { conteudo: 'Iniciativas sazonais com arrecadação de brinquedos, alimentos e itens de apoio.' }
  );
}

const projectRows = [
  { titulo: 'Projeto Santa Dulce dos Pobres', descricao: 'Casa de Contraturno Escolar Santa Dulce dos Pobres, voltada ao cuidado, educação, convivência e proteção de crianças no período oposto ao escolar.', imagem_url: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80', destaque: 1, ativo: 1 },
  { titulo: 'Bazar Social', descricao: 'Espaço solidário que ajuda a manter ações sociais e amplia o acesso da comunidade a itens essenciais.', imagem_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80', destaque: 0, ativo: 1 },
  { titulo: 'Apoio com Cestas Básicas', descricao: 'Mobilização para apoiar famílias em insegurança alimentar com alimentos e itens de primeira necessidade.', imagem_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80', destaque: 0, ativo: 1 },
  { titulo: 'Apoio com Fraldas e Enxovais', descricao: 'Apoio a bebês, idosos e famílias que precisam de cuidado material e acolhimento.', imagem_url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=80', destaque: 0, ativo: 1 }
];

const campaignRows = [
  { titulo: 'Cestas básicas para famílias atendidas', descricao: 'Campanha de arrecadação organizada por contato direto com a instituição. O site não recebe pagamentos nem doações online.', meta: '100 cestas básicas', status: 'Em andamento', imagem_url: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=80', ativo: 1 },
  { titulo: 'Campanha de fraldas', descricao: 'Recebimento de fraldas infantis e geriátricas combinado diretamente pelo WhatsApp institucional.', meta: '300 pacotes de fraldas', status: 'Em andamento', imagem_url: 'https://images.unsplash.com/photo-1586065797225-0de3670f65c7?auto=format&fit=crop&w=1200&q=80', ativo: 1 },
  { titulo: 'Enxovais solidários', descricao: 'Montagem de kits de enxoval com apoio de pessoas, empresas e voluntários em contato com a ONG.', meta: '50 kits de enxoval', status: 'Planejada', imagem_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80', ativo: 1 }
];

const partnerRows = [
  { nome: 'ASA - Ação Social Arquidiocesana de Florianópolis', descricao: 'Parceira institucional no fortalecimento da rede de ação social.', logo_url: '', site_url: 'https://arquifln.org.br/', ativo: 1 },
  { nome: 'Cáritas Brasil', descricao: 'Rede de solidariedade e promoção da dignidade humana.', logo_url: '', site_url: 'https://caritas.org.br/', ativo: 1 },
  { nome: 'Empresas parceiras', descricao: 'Espaço aberto para empresas que desejam apoiar projetos sociais e necessidades comunitárias.', logo_url: '', site_url: '', ativo: 1 }
];

const newsRows = [
  { titulo: 'Bazares Solidários', resumo: 'Eventos comunitários para arrecadar recursos e aproximar apoiadores da causa.', conteudo: 'Os bazares solidários são oportunidades de participação da comunidade e apoio direto às ações sociais.', data_evento: '2026-06-15', imagem_url: 'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=1200&q=80', ativo: 1 },
  { titulo: 'Café Colonial Temático', resumo: 'Encontro beneficente para fortalecer os projetos da instituição.', conteudo: 'Evento pensado para reunir famílias, apoiadores e empresas parceiras em torno da solidariedade.', data_evento: '2026-07-20', imagem_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', ativo: 1 },
  { titulo: 'Festa das Crianças e Natal', resumo: 'Ações especiais para celebrar datas importantes com crianças e famílias atendidas.', conteudo: 'Iniciativas sazonais com arrecadação de brinquedos, alimentos e itens de apoio.', data_evento: '2026-10-12', imagem_url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80', ativo: 1 }
];

const galleryRows = [
  { titulo: 'Acolhimento comunitário', descricao: 'Registro ilustrativo das ações de convivência.', imagem_url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80', categoria: 'Ações' },
  { titulo: 'Contraturno escolar', descricao: 'Imagem de referência para a Casa Santa Dulce dos Pobres.', imagem_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', categoria: 'Santa Dulce' }
];

module.exports = { ensureInitialData };
