const bcrypt = require('bcryptjs');
const { run, get } = require('./db');

async function ensureInitialData() {
  await ensureAdmin();
  await ensureConfig();
  await seedIfEmpty('projetos', projectRows, 'INSERT INTO projetos (titulo, descricao, imagem_url, destaque, ativo) VALUES (?, ?, ?, ?, ?)');
  await seedIfEmpty('campanhas', campaignRows, 'INSERT INTO campanhas (titulo, descricao, meta, status, imagem_url, ativo) VALUES (?, ?, ?, ?, ?, ?)');
  await seedIfEmpty('parceiros', partnerRows, 'INSERT INTO parceiros (nome, descricao, logo_url, site_url, ativo) VALUES (?, ?, ?, ?, ?)');
  await seedIfEmpty('noticias_eventos', newsRows, 'INSERT INTO noticias_eventos (titulo, resumo, conteudo, data_evento, imagem_url, ativo) VALUES (?, ?, ?, ?, ?, ?)');
  await seedIfEmpty('documentos_transparencia', documentRows, 'INSERT INTO documentos_transparencia (nome, descricao, link_url, tipo) VALUES (?, ?, ?, ?)');
  await seedIfEmpty('galeria', galleryRows, 'INSERT INTO galeria (titulo, descricao, imagem_url, categoria) VALUES (?, ?, ?, ?)');
}

async function ensureAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@asp.org.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const existingAdmin = await get('SELECT id FROM usuarios_admin WHERE email = ?', [adminEmail]);
  if (existingAdmin) return;

  const senhaHash = await bcrypt.hash(adminPassword, 10);
  await run('INSERT INTO usuarios_admin (nome, email, senha_hash) VALUES (?, ?, ?)', [
    'Administrador ASP',
    adminEmail,
    senhaHash
  ]);
}

async function ensureConfig() {
  const config = await get('SELECT id FROM configuracoes_ong WHERE id = 1');
  if (config) return;

  await run(
    `INSERT INTO configuracoes_ong (id, nome, texto_institucional, whatsapp, email, endereco, cnpj)
     VALUES (1, ?, ?, ?, ?, ?, ?)`,
    [
      'Ação Social Paroquial São João Batista',
      'Há 49 anos em Itajaí/SC, a Ação Social Paroquial São João Batista acolhe famílias em situação de vulnerabilidade social com escuta, apoio e projetos que fortalecem vínculos comunitários.',
      '5547999999999',
      'contato@acaosocialsaojoao.org.br',
      'Itajaí/SC - endereço institucional a confirmar',
      '00.000.000/0001-00'
    ]
  );
}

async function seedIfEmpty(table, rows, sql) {
  const existing = await get(`SELECT COUNT(*) as total FROM ${table}`);
  if (existing.total > 0) return;
  for (const row of rows) {
    await run(sql, row);
  }
}

const projectRows = [
  ['Projeto Santa Dulce dos Pobres', 'Casa de Contraturno Escolar Santa Dulce dos Pobres, voltada ao cuidado, educação, convivência e proteção de crianças no período oposto ao escolar.', 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80', 1, 1],
  ['Bazar Social', 'Espaço solidário que ajuda a manter ações sociais e amplia o acesso da comunidade a itens essenciais.', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80', 0, 1],
  ['Campanhas de Cestas Básicas', 'Mobilização para apoiar famílias em insegurança alimentar com alimentos e itens de primeira necessidade.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80', 0, 1],
  ['Campanhas de Fraldas e Enxovais', 'Apoio a bebês, idosos e famílias que precisam de cuidado material e acolhimento.', 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=80', 0, 1]
];

const campaignRows = [
  ['Cestas básicas para famílias atendidas', 'Campanha de arrecadação organizada por contato direto com a instituição. O site não recebe pagamentos nem doações online.', '100 cestas básicas', 'Em andamento', 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=80', 1],
  ['Campanha de fraldas', 'Recebimento de fraldas infantis e geriátricas combinado diretamente pelo WhatsApp institucional.', '300 pacotes de fraldas', 'Em andamento', 'https://images.unsplash.com/photo-1586065797225-0de3670f65c7?auto=format&fit=crop&w=1200&q=80', 1],
  ['Enxovais solidários', 'Montagem de kits de enxoval com apoio de pessoas, empresas e voluntários em contato com a ONG.', '50 kits de enxoval', 'Planejada', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80', 1]
];

const partnerRows = [
  ['ASA - Ação Social Arquidiocesana de Florianópolis', 'Parceira institucional no fortalecimento da rede de ação social.', '', 'https://arquifln.org.br/', 1],
  ['Cáritas Brasil', 'Rede de solidariedade e promoção da dignidade humana.', '', 'https://caritas.org.br/', 1],
  ['Empresas parceiras', 'Espaço aberto para empresas que desejam apoiar campanhas e projetos sociais.', '', '', 1]
];

const newsRows = [
  ['Bazares Solidários', 'Eventos comunitários para arrecadar recursos e aproximar apoiadores da causa.', 'Os bazares solidários são oportunidades de participação da comunidade e apoio direto às ações sociais.', '2026-06-15', 'https://images.unsplash.com/photo-1470309864661-68328b2cd0a5?auto=format&fit=crop&w=1200&q=80', 1],
  ['Café Colonial Temático', 'Encontro beneficente para fortalecer os projetos da instituição.', 'Evento pensado para reunir famílias, apoiadores e empresas parceiras em torno da solidariedade.', '2026-07-20', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', 1],
  ['Festa das Crianças e Natal', 'Ações especiais para celebrar datas importantes com crianças e famílias atendidas.', 'Campanhas sazonais com arrecadação de brinquedos, alimentos e itens de apoio.', '2026-10-12', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80', 1]
];

const documentRows = [
  ['CNPJ', 'Comprovante de inscrição cadastral da instituição.', '#', 'Cadastro'],
  ['Estatuto Social', 'Documento estatutário da Ação Social Paroquial São João Batista.', '#', 'Estatuto'],
  ['Prestação de contas', 'Área preparada para relatórios institucionais e demonstrativos publicados pela ONG.', '#', 'Prestação de contas'],
  ['Relatório bimestral de ações', 'Modelo de listagem para relatórios periódicos das atividades.', '#', 'Relatório']
];

const galleryRows = [
  ['Acolhimento comunitário', 'Registro ilustrativo das ações de convivência.', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80', 'Ações'],
  ['Contraturno escolar', 'Imagem de referência para a Casa Santa Dulce dos Pobres.', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80', 'Santa Dulce']
];

module.exports = { ensureInitialData };
