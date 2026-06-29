const multer = require('multer');
const { authRequired } = require('./auth');
const mongoose = require('mongoose');

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Tipo de arquivo não permitido. Use imagem, PDF ou documento Word.'));
    }
    return callback(null, true);
  }
});

const uploadSchema = new mongoose.Schema({
  originalName: String,
  mimeType: String,
  data: String,
  criado_em: { type: Date, default: Date.now }
});

const Upload = mongoose.models.Upload || mongoose.model('Upload', uploadSchema);

function registerUploadRoutes(app) {
  app.post('/api/upload', authRequired, (req, res, next) => {
    upload.single('arquivo')(req, res, async (error) => {
      if (error) {
        const message = error.code === 'LIMIT_FILE_SIZE'
          ? 'Arquivo muito grande. O limite é de 5 MB.'
          : error.message;
        return res.status(400).json({ message });
      }
      if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });

      try {
        const base64 = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

        const doc = await Upload.create({
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          data: dataUrl
        });

        return res.status(201).json({
          fileName: doc._id.toString(),
          originalName: req.file.originalname,
          url: `/api/uploads/${doc._id}`
        });
      } catch (uploadError) {
        return next(uploadError);
      }
    });
  });

  app.get('/api/uploads/:id', async (req, res, next) => {
    try {
      const doc = await Upload.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Arquivo não encontrado.' });

      const [header, base64Data] = doc.data.split(',');
      const mimeMatch = header.match(/data:([^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
      const buffer = Buffer.from(base64Data, 'base64');

      res.set('Content-Type', mimeType);
      res.set('Cache-Control', 'public, max-age=31536000');
      return res.send(buffer);
    } catch (err) {
      return next(err);
    }
  });
}

module.exports = { registerUploadRoutes };
