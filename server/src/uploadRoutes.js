const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { authRequired } = require('./auth');

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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(new Error('Tipo de arquivo não permitido. Use imagem, PDF ou documento Word.'));
    }
    return callback(null, true);
  }
});

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no .env.');
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
  });
}

function uploadToCloudinary(file) {
  configureCloudinary();

  const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'acao-social-sao-joao-batista',
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

function registerUploadRoutes(app) {
  app.post('/api/upload', authRequired, (req, res, next) => {
    upload.single('arquivo')(req, res, async (error) => {
      if (error) {
        const message = error.code === 'LIMIT_FILE_SIZE'
          ? 'Arquivo muito grande. O limite é de 10 MB.'
          : error.message;
        return res.status(400).json({ message });
      }
      if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });

      try {
        const result = await uploadToCloudinary(req.file);
        return res.status(201).json({
          fileName: result.public_id,
          originalName: req.file.originalname,
          url: result.secure_url
        });
      } catch (uploadError) {
        return next(uploadError);
      }
    });
  });
}

module.exports = { registerUploadRoutes };
