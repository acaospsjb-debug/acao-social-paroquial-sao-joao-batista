const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('./env');

const { ensureInitialData } = require('./initialData');
const { authRequired } = require('./auth');
const { registerCrudRoutes } = require('./crudRoutes');
const { registerUploadRoutes } = require('./uploadRoutes');
const { connectMongo, getMongoStatus } = require('./mongo');
const {
  User,
  Configuracao,
  Projeto,
  Campanha,
  Parceiro,
  NoticiaEvento,
  DocumentoTransparencia,
  Galeria
} = require('./models');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
registerUploadRoutes(app);

app.get('/', (_req, res) => res.send('API da Acao Social rodando'));

app.get('/health', (_req, res) => res.json({ status: 'ok', database: getMongoStatus() }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: getMongoStatus() }));

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ message: 'Informe e-mail e senha.' });

    const user = await User.findOne({ email });
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
    const config = await Configuracao.findOne();
    res.json(config);
  } catch (error) {
    next(error);
  }
});

app.put('/api/configuracoes', authRequired, async (req, res, next) => {
  try {
    const fields = ['nome', 'texto_institucional', 'whatsapp', 'email', 'endereco', 'cnpj'];
    if (!req.body.nome) return res.status(400).json({ message: 'Nome da ONG é obrigatório.' });
    const payload = fields.reduce((data, field) => {
      data[field] = req.body[field] ?? '';
      return data;
    }, {});
    const existing = await Configuracao.findOne();
    const config = existing
      ? await Configuracao.findByIdAndUpdate(existing.id, payload, { new: true, runValidators: true })
      : await Configuracao.create(payload);
    res.json(config);
  } catch (error) {
    next(error);
  }
});

registerCrudRoutes(app);

app.get('/api/admin/dashboard', authRequired, async (_req, res, next) => {
  try {
    const [projetos, campanhas, parceiros, noticias, documentos, galeria] = await Promise.all([
      Projeto.countDocuments(),
      Campanha.countDocuments(),
      Parceiro.countDocuments(),
      NoticiaEvento.countDocuments(),
      DocumentoTransparencia.countDocuments(),
      Galeria.countDocuments()
    ]);
    res.json({ projetos, campanhas, parceiros, noticiasEventos: noticias, documentos, galeria });
  } catch (error) {
    next(error);
  }
});

app.get('/api/site/resumo', async (_req, res, next) => {
  try {
    const [configuracoes, projetos, campanhas, parceiros, noticiasEventos, documentos, galeria] = await Promise.all([
      Configuracao.findOne(),
      Projeto.find({ ativo: 1 }).sort({ destaque: -1, criado_em: -1 }),
      Campanha.find({ ativo: 1 }).sort({ criado_em: -1 }),
      Parceiro.find({ ativo: 1 }).sort({ criado_em: -1 }),
      NoticiaEvento.find({ ativo: 1 }).sort({ data_evento: -1, criado_em: -1 }),
      DocumentoTransparencia.find().sort({ criado_em: -1 }),
      Galeria.find().sort({ criado_em: -1 })
    ]);
    res.json({ configuracoes, projetos, campanhas, parceiros, noticiasEventos, documentos, galeria });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno no servidor.' });
});

async function startServer() {
  await connectMongo();
  await ensureInitialData();

  app.listen(port, () => console.log(`API rodando em http://localhost:${port}`));
}

startServer().catch((error) => {
  console.error('Erro ao iniciar servidor:', error.message);
  process.exit(1);
});
