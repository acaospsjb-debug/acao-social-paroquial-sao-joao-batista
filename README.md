# Site Institucional — Ação Social Paroquial São João Batista

Projeto de extensão desenvolvido por alunos da Univali para a Ação Social Paroquial São João Batista, entidade civil sem fins lucrativos com atuação em Itajaí/SC há 49 anos.

O sistema funciona como carta de apresentação digital da ONG, com foco em divulgação dos projetos sociais, fortalecimento da transparência, valorização dos parceiros e geração de contato pelo WhatsApp.

## Sistema em produção

- **Site:** https://acaosocialsjb.vercel.app *(URL curta — ver configuração na Vercel)*
- **API:** https://asp-sjb-api.onrender.com

> O servidor gratuito do Render pode demorar até 1 minuto para responder após um período sem uso. Aguarde e tente novamente.

## Stack

- Frontend: React + Vite, Tailwind CSS, React Router DOM
- Backend: Node.js + Express
- Banco: MongoDB Atlas via Mongoose
- Autenticação: JWT + senha criptografada com bcrypt
- Imagens: armazenadas no MongoDB como base64

## MongoDB Atlas

O backend conecta no MongoDB Atlas usando Mongoose.

- Nome do banco: `acao_social`
- Variavel de ambiente obrigatoria: `MONGODB_URI`
- A string real do Atlas deve ficar somente no arquivo `.env` local ou nas variaveis de ambiente da hospedagem.
- Nao coloque usuario e senha do MongoDB no codigo.

Exemplo de `.env` local:

```env
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.f2eoii1.mongodb.net/acao_social?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
ADMIN_EMAIL=seu-email-admin
ADMIN_PASSWORD=sua-senha-admin
JWT_SECRET=uma-chave-grande-e-secreta
```

## Instalação

Opção mais simples, a partir da pasta raiz do projeto:

```bash
npm install
npm run dev
```

O comando `npm run dev` sobe backend e frontend ao mesmo tempo.

Antes de iniciar, configure o arquivo `.env` na raiz do projeto com as variáveis de ambiente do backend.

```env
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.f2eoii1.mongodb.net/acao_social?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
ADMIN_EMAIL=email-do-admin
ADMIN_PASSWORD=senha-do-admin
JWT_SECRET=uma-chave-grande-e-secreta
```

Opcao manual para rodar somente o backend:

```bash
cd server
npm install
npm run dev
```

Em outro terminal:

```bash
cd client
npm install
npm run dev
```

No Windows, se o PowerShell bloquear `npm`, use `npm.cmd` no lugar de `npm`.

URLs padrão:

- Site público: `http://localhost:5173`
- API: `http://localhost:3000`
- Painel admin: `http://localhost:5173/admin`

## Login do painel

O login administrativo é criado automaticamente no MongoDB usando `ADMIN_EMAIL` e `ADMIN_PASSWORD`.
Essas credenciais devem ficar somente no `.env` local e nas variáveis de ambiente da hospedagem.

## O que está pronto

- Páginas públicas: Início, Sobre, Projeto Santa Dulce dos Pobres, Projetos e Ações, Campanhas e Metas, Transparência, Parceiros, Notícias e Eventos, Contato.
- Botões estratégicos de WhatsApp usando link `wa.me`.
- API REST com CRUD para projetos, campanhas, parceiros, notícias/eventos, documentos e galeria.
- Painel `/admin` com login, dashboard, CRUDs e edição de dados básicos da ONG.
- Conexao com MongoDB Atlas configurada para a API.
- Estrutura visual para documentos de transparência e parceiros.
- Inicialização automática dos dados mínimos ao subir a API, caso o banco ainda esteja vazio.
- Upload local de imagens, logomarcas e documentos pelo painel administrativo.

## Upload de arquivos

O painel permite enviar arquivos diretamente do computador para imagens de projetos, campanhas, notícias, galeria, logomarcas de parceiros e documentos de transparência.

- Os arquivos são armazenados diretamente no MongoDB como base64, sem necessidade de serviço externo.
- Tipos aceitos: JPG, PNG, WEBP, SVG, PDF, DOC e DOCX.
- Limite por arquivo: 5 MB.

## Publicacao

O sistema está implantado com a seguinte arquitetura:

- **Frontend:** Vercel (detecta automaticamente projetos Vite; `client/vercel.json` configura o roteamento SPA)
- **Backend:** Render (Web Service gratuito com Node.js)
- **Banco:** MongoDB Atlas (cluster gratuito em nuvem)

Variáveis de ambiente necessárias no backend (Render):

```env
MONGODB_URI=mongodb+srv://USUARIO:SENHA@cluster0.f2eoii1.mongodb.net/acao_social?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
ADMIN_EMAIL=seu-email-admin
ADMIN_PASSWORD=sua-senha-admin
JWT_SECRET=uma-chave-grande-e-secreta
CORS_ORIGINS=https://seu-frontend.vercel.app
```

O frontend deve apontar para a URL pública do backend usando a variável `VITE_API_URL` configurada no Vercel.

## Endpoints principais

- `GET /api/configuracoes`
- `PUT /api/configuracoes`
- `GET|POST /api/projetos`
- `PUT|DELETE /api/projetos/:id`
- `GET|POST /api/campanhas`
- `PUT|DELETE /api/campanhas/:id`
- `GET|POST /api/parceiros`
- `PUT|DELETE /api/parceiros/:id`
- `GET|POST /api/noticias-eventos`
- `PUT|DELETE /api/noticias-eventos/:id`
- `GET|POST /api/documentos`
- `PUT|DELETE /api/documentos/:id`
- `GET|POST /api/galeria`
- `PUT|DELETE /api/galeria/:id`
- `POST /api/auth/login`
- `GET /`
- `GET /health`

## Fora do escopo do MVP

Este projeto não implementa pagamento online, checkout, gateway de doação, gestão financeira, estoque, cadastro de famílias ou controle de doadores.

As campanhas e metas servem para apresentação institucional e conversão para WhatsApp. A forma de apoio deve ser combinada diretamente com a ONG.

## Evoluções futuras

- Recuperação de senha e gestão de múltiplos usuários administrativos.
- Publicação de relatórios reais em PDF.
- Métricas consolidadas de famílias atendidas.
- Área de relatos com autorização formal de uso de imagem e nome.
- Deploy em servidor institucional com variáveis de ambiente e rotina de backup dos uploads.
