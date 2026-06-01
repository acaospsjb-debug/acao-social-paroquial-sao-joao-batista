const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { createSchema } = require('./schema');
const { ensureInitialData } = require('./initialData');
const { get, run, all } = require('./db');
const { authRequired } = require('./auth');
const { registerCrudRoutes } = require('./crudRoutes');
const { registerUploadRoutes } = require('./uploadRoutes');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
registerUploadRoutes(app);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ message: 'Informe e-mail e senha.' });

    const user = await get('SELECT * FROM usuarios_admin WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const valid = await bcrypt.compare(senha, user.senha_hash);
    if (!valid) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, process.env.JWT_SECRET || 'dev-secret', {
      expiresIn: '8h'
    });
    return res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (error) {
    next(error);
  }
});

app.get('/api/configuracoes', async (_req, res, next) => {
  try {
    const config = await get('SELECT * FROM configuracoes_ong WHERE id = 1');
    res.json(config);
  } catch (error) {
    next(error);
  }
});

app.put('/api/configuracoes', authRequired, async (req, res, next) => {
  try {
    const fields = ['nome', 'texto_institucional', 'whatsapp', 'email', 'endereco', 'cnpj'];
    if (!req.body.nome) return res.status(400).json({ message: 'Nome da ONG é obrigatório.' });
    await run(
      `UPDATE configuracoes_ong SET ${fields.map((field) => `${field} = ?`).join(', ')}, atualizado_em = CURRENT_TIMESTAMP WHERE id = 1`,
      fields.map((field) => req.body[field] ?? '')
    );
    const config = await get('SELECT * FROM configuracoes_ong WHERE id = 1');
    res.json(config);
  } catch (error) {
    next(error);
  }
});

registerCrudRoutes(app);

app.get('/api/admin/dashboard', authRequired, async (_req, res, next) => {
  try {
    const [projetos, campanhas, parceiros, noticias, documentos, galeria] = await Promise.all([
      count('projetos'),
      count('campanhas'),
      count('parceiros'),
      count('noticias_eventos'),
      count('documentos_transparencia'),
      count('galeria')
    ]);
    res.json({ projetos, campanhas, parceiros, noticiasEventos: noticias, documentos, galeria });
  } catch (error) {
    next(error);
  }
});

app.get('/api/site/resumo', async (_req, res, next) => {
  try {
    const [configuracoes, projetos, campanhas, parceiros, noticiasEventos, documentos, galeria] = await Promise.all([
      get('SELECT * FROM configuracoes_ong WHERE id = 1'),
      all('SELECT * FROM projetos WHERE ativo = 1 ORDER BY destaque DESC, id DESC'),
      all('SELECT * FROM campanhas WHERE ativo = 1 ORDER BY id DESC'),
      all('SELECT * FROM parceiros WHERE ativo = 1 ORDER BY id DESC'),
      all('SELECT * FROM noticias_eventos WHERE ativo = 1 ORDER BY data_evento DESC, id DESC'),
      all('SELECT * FROM documentos_transparencia ORDER BY id DESC'),
      all('SELECT * FROM galeria ORDER BY id DESC')
    ]);
    res.json({ configuracoes, projetos, campanhas, parceiros, noticiasEventos, documentos, galeria });
  } catch (error) {
    next(error);
  }
});

function count(table) {
  return get(`SELECT COUNT(*) as total FROM ${table}`).then((row) => row.total);
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno no servidor.' });
});

createSchema().then(ensureInitialData).then(() => {
  app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
});
