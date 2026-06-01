const express = require('express');
const { all, get, run } = require('./db');
const { authRequired } = require('./auth');

const tables = {
  projetos: {
    table: 'projetos',
    fields: ['titulo', 'descricao', 'imagem_url', 'destaque', 'ativo'],
    required: ['titulo', 'descricao']
  },
  campanhas: {
    table: 'campanhas',
    fields: ['titulo', 'descricao', 'meta', 'status', 'imagem_url', 'ativo'],
    required: ['titulo', 'descricao']
  },
  parceiros: {
    table: 'parceiros',
    fields: ['nome', 'descricao', 'logo_url', 'site_url', 'ativo'],
    required: ['nome']
  },
  'noticias-eventos': {
    table: 'noticias_eventos',
    fields: ['titulo', 'resumo', 'conteudo', 'data_evento', 'imagem_url', 'ativo'],
    required: ['titulo', 'resumo']
  },
  documentos: {
    table: 'documentos_transparencia',
    fields: ['nome', 'descricao', 'link_url', 'tipo'],
    required: ['nome', 'link_url']
  },
  galeria: {
    table: 'galeria',
    fields: ['titulo', 'descricao', 'imagem_url', 'categoria'],
    required: ['titulo', 'imagem_url']
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

function registerCrudRoutes(app) {
  Object.entries(tables).forEach(([route, config]) => {
    const router = express.Router();

    router.get('/', async (_req, res, next) => {
      try {
        const rows = await all(`SELECT * FROM ${config.table} ORDER BY id DESC`);
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

        const placeholders = config.fields.map(() => '?').join(', ');
        const result = await run(
          `INSERT INTO ${config.table} (${config.fields.join(', ')}) VALUES (${placeholders})`,
          config.fields.map((field) => data[field])
        );
        const created = await get(`SELECT * FROM ${config.table} WHERE id = ?`, [result.id]);
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

        const set = config.fields.map((field) => `${field} = ?`).join(', ');
        await run(`UPDATE ${config.table} SET ${set} WHERE id = ?`, [...config.fields.map((field) => data[field]), req.params.id]);
        const updated = await get(`SELECT * FROM ${config.table} WHERE id = ?`, [req.params.id]);
        return res.json(updated);
      } catch (error) {
        next(error);
      }
    });

    router.delete('/:id', authRequired, async (req, res, next) => {
      try {
        await run(`DELETE FROM ${config.table} WHERE id = ?`, [req.params.id]);
        return res.json({ message: 'Registro excluído com sucesso.' });
      } catch (error) {
        next(error);
      }
    });

    app.use(`/api/${route}`, router);
  });
}

module.exports = { registerCrudRoutes };
