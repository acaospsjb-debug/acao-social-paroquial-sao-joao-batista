const { run } = require('./db');

async function createSchema() {
  await run(`CREATE TABLE IF NOT EXISTS usuarios_admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS configuracoes_ong (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    nome TEXT NOT NULL,
    texto_institucional TEXT,
    whatsapp TEXT,
    email TEXT,
    endereco TEXT,
    cnpj TEXT,
    atualizado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS projetos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    imagem_url TEXT,
    destaque INTEGER DEFAULT 0,
    ativo INTEGER DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS campanhas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    meta TEXT,
    status TEXT DEFAULT 'Em andamento',
    imagem_url TEXT,
    ativo INTEGER DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS parceiros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    logo_url TEXT,
    site_url TEXT,
    ativo INTEGER DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS noticias_eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    resumo TEXT NOT NULL,
    conteudo TEXT,
    data_evento TEXT,
    imagem_url TEXT,
    ativo INTEGER DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS documentos_transparencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    link_url TEXT NOT NULL,
    tipo TEXT DEFAULT 'Documento',
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS galeria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descricao TEXT,
    imagem_url TEXT NOT NULL,
    categoria TEXT DEFAULT 'Ações',
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
}

module.exports = { createSchema };
