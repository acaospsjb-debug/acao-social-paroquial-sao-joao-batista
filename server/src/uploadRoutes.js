const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { authRequired } = require('./auth');

const uploadDir = path.resolve(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const safeName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`;
    callback(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Tipo de arquivo não permitido. Use imagem, PDF ou documento Word.'));
    }
    return callback(null, true);
  }
});

function registerUploadRoutes(app) {
  app.use('/uploads', express.static(uploadDir));

  app.post('/api/upload', authRequired, (req, res, next) => {
    upload.single('arquivo')(req, res, (error) => {
      if (error) {
        const message = error.code === 'LIMIT_FILE_SIZE'
          ? 'Arquivo muito grande. O limite é de 10 MB.'
          : error.message;
        return res.status(400).json({ message });
      }
      if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      return res.status(201).json({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        url: `${baseUrl}/uploads/${req.file.filename}`
      });
    });
  });
}

module.exports = { registerUploadRoutes };
