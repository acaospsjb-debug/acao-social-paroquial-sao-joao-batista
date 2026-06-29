const mongoose = require('mongoose');

const baseOptions = {
  versionKey: false,
  timestamps: { createdAt: 'criado_em', updatedAt: 'atualizado_em' },
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
};

const User = mongoose.model('UsuarioAdmin', new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  senha_hash: { type: String, required: true }
}, { ...baseOptions, collection: 'usuarios_admin' }));

const Configuracao = mongoose.model('ConfiguracaoOng', new mongoose.Schema({
  nome: { type: String, required: true },
  texto_institucional: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  endereco: { type: String, default: '' },
  cnpj: { type: String, default: '' },
  hero_video_url: { type: String, default: '' },
  hero_video_poster_url: { type: String, default: '' },
  paginas_visiveis: {
    type: Map,
    of: Number,
    default: () => ({
      inicio: 1,
      sobre: 1,
      santa_dulce: 1,
      projetos: 1,
      transparencia: 1,
      parceiros: 1,
      noticias: 1,
      contato: 1
    })
  }
}, { ...baseOptions, collection: 'configuracoes_ong' }));

const Projeto = mongoose.model('Projeto', new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  imagem_url: { type: String, default: '' },
  destaque: { type: Number, default: 0 },
  ativo: { type: Number, default: 1 }
}, { ...baseOptions, collection: 'projetos' }));

const Campanha = mongoose.model('Campanha', new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  meta: { type: String, default: '' },
  status: { type: String, default: 'Em andamento' },
  imagem_url: { type: String, default: '' },
  ativo: { type: Number, default: 1 }
}, { ...baseOptions, collection: 'campanhas' }));

const Parceiro = mongoose.model('Parceiro', new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, default: '' },
  logo_url: { type: String, default: '' },
  site_url: { type: String, default: '' },
  ativo: { type: Number, default: 1 }
}, { ...baseOptions, collection: 'parceiros' }));

const NoticiaEvento = mongoose.model('NoticiaEvento', new mongoose.Schema({
  titulo: { type: String, required: true },
  resumo: { type: String, required: true },
  conteudo: { type: String, default: '' },
  data_evento: { type: String, default: '' },
  imagem_url: { type: String, default: '' },
  ativo: { type: Number, default: 1 }
}, { ...baseOptions, collection: 'noticias_eventos' }));

const DocumentoTransparencia = mongoose.model('DocumentoTransparencia', new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, default: '' },
  link_url: { type: String, required: true },
  tipo: { type: String, default: 'Documento' }
}, { ...baseOptions, collection: 'documentos_transparencia' }));

const Galeria = mongoose.model('Galeria', new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String, default: '' },
  imagem_url: { type: String, required: true },
  categoria: { type: String, default: 'Ações' }
}, { ...baseOptions, collection: 'galeria' }));

const LinkExterno = mongoose.model('LinkExterno', new mongoose.Schema({
  nome: { type: String, required: true },
  url: { type: String, required: true },
  plataforma: { type: String, default: 'Site externo' },
  ativo: { type: Number, default: 1 },
  nova_aba: { type: Number, default: 1 }
}, { ...baseOptions, collection: 'links_externos' }));

module.exports = {
  User,
  Configuracao,
  Projeto,
  Campanha,
  Parceiro,
  NoticiaEvento,
  DocumentoTransparencia,
  Galeria,
  LinkExterno
};
