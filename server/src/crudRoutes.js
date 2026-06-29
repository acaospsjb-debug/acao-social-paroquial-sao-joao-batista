const express = require('express');
const { authRequired } = require('./auth');
const {
  Projeto,
  Campanha,
  Parceiro,
  NoticiaEvento,
  Galeria,
  LinkExterno,
  Documento
} = require('./models');

const tables = {
  projetos: {
    model: Projeto,
    fields: ['titulo', 'descricao', 'imagem_url', 'destaque', 'ativo'],
    required: ['titulo', 'descricao']
  },
  campanhas: {
    model: Campanha,
    fields: ['titulo', 'descricao', 'meta', 'status', 'imagem_url', 'ativo'],
    required: ['titulo', 'descricao']
  },
  parceiros: {
    model: Parceiro,
    fields: ['nome', 'descricao', 'logo_url', 'site_url', 'ativo'],
    required: ['nome']
  },
  'noticias-eventos': {
    model: NoticiaEvento,
    fields: ['titulo', 'resumo', 'conteudo', 'data_evento', 'imagem_url', 'ativo'],
    required: ['titulo', 'resumo']
  },
  galeria: {
    model: Galeria,
    fields: ['titulo', 'descricao', 'imagem_url', 'categoria'],
    required: ['titulo', 'imagem_url']
  },
  'links-externos': {
    model: LinkExterno,
    fields: ['nome', 'url', 'plataforma', 'ativo', 'nova_aba'],
    required: ['nome', 'url'],
    urlFields: ['url']
  },
  documentos: {
    model: Documento,
    fields: ['titulo', 'descricao', 'arquivo_url', 'ativo'],
    required: ['titulo']
  }
};

function sanitizeBody(body, fields) {
  return fields.reduce((data, field) => {
    data[field] = body[field] ?? null;
    return data;
  }, {});
}

function validate(data, required) {
  return required.filter((field) => !String(data[field] || '').trim());
}

function hasInvalidUrl(data, fields = []) {
  return fields.some((field) => {
    const value = String(data[field] || '').trim();
    if (!value) return false;
    try {
      const url = new URL(value);
      return !['http:', 'https:'].includes(url.protocol);
    } catch (_error) {
      return true;
    }
  });
}

function registerCrudRoutes(app) {
  Object.entries(tables).forEach(([route, config]) => {
    const router = express.Router();

    router.get('/', async (_req, res, next) => {
      try {
        const rows = await config.model.find().sort({ criado_em: -1 });
        res.json(rows);
      } catch (error) {
        next(error);
      }
    });

    router.post('/', authRequired, async (req, res, next) => {
      try {
        const data = sanitizeBody(req.body, config.fields);
        const missing = validate(data, config.required);
        if (missing.length) return res.status(400).json({ message: `Campos obrigatórios: ${missing.join(', ')}` });
        if (hasInvalidUrl(data, config.urlFields)) return res.status(400).json({ message: 'Informe uma URL válida começando com http:// ou https://.' });

        const created = await config.model.create(data);
        return res.status(201).json(created);
      } catch (error) {
        next(error);
      }
    });

    router.put('/:id', authRequired, async (req, res, next) => {
      try {
        const data = sanitizeBody(req.body, config.fields);
        const missing = validate(data, config.required);
        if (missing.length) return res.status(400).json({ message: `Campos obrigatórios: ${missing.join(', ')}` });
        if (hasInvalidUrl(data, config.urlFields)) return res.status(400).json({ message: 'Informe uma URL válida começando com http:// ou https://.' });

        const updated = await config.model.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Registro não encontrado.' });
        return res.json(updated);
      } catch (error) {
        next(error);
      }
    });

    router.delete('/:id', authRequired, async (req, res, next) => {
      try {
        await config.model.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Registro excluído com sucesso.' });
      } catch (error) {
        next(error);
      }
    });

    app.use(`/api/${route}`, router);
  });
}

module.exports = { registerCrudRoutes };
