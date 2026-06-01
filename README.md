# MVP - Ação Social Paroquial São João Batista

Site institucional com painel administrativo simples para a ONG Ação Social Paroquial São João Batista, com foco no Projeto Santa Dulce dos Pobres.

## Stack

- Frontend: React + Vite, Tailwind CSS, React Router DOM
- Backend: Node.js + Express
- Banco local: SQLite
- Autenticação: JWT + senha criptografada com bcrypt

## Banco de dados SQLite

O servidor usa SQLite para persistir os conteúdos administráveis do site.

- Caminho padrão: `./database/site.db`
- Variável para personalizar o caminho: `DATABASE_PATH`
- Se `DATABASE_PATH` não for definida, o sistema usa automaticamente `./database/site.db`.
- A pasta `database` é criada automaticamente se não existir.
- As tabelas são criadas automaticamente ao iniciar o servidor, sem apagar dados existentes.
- O banco não é recriado quando já existe.
- Os dados do site ficam no servidor e continuam salvos após F5, limpeza de cache, limpeza de cookies ou fechamento do navegador.

## Instalação

Opção mais simples, a partir da pasta raiz do projeto:

```bash
npm install
npm run seed
npm run dev
```

O comando `npm run dev` sobe backend e frontend ao mesmo tempo.

Opção manual, em dois terminais:

```bash
cd server
npm install
copy .env.example .env
npm run seed
npm run dev
```

Em outro terminal:

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

No Windows, se o PowerShell bloquear `npm`, use `npm.cmd` no lugar de `npm`.

URLs padrão:

- Site público: `http://localhost:5173`
- API: `http://localhost:4000`
- Painel admin: `http://localhost:5173/admin`

## Login inicial do painel

- E-mail: `admin@asp.org.br`
- Senha: `admin123`

Altere estes dados no `.env` antes de recriar o seed em um ambiente real.

## O que está pronto

- Páginas públicas: Início, Sobre, Projeto Santa Dulce dos Pobres, Projetos e Ações, Campanhas e Metas, Transparência, Parceiros, Notícias e Eventos, Contato.
- Botões estratégicos de WhatsApp usando link `wa.me`.
- API REST com CRUD para projetos, campanhas, parceiros, notícias/eventos, documentos e galeria.
- Painel `/admin` com login, dashboard, CRUDs e edição de dados básicos da ONG.
- Banco SQLite com tabelas e seed inicial baseado no contexto da ONG.
- Estrutura visual para documentos de transparência e parceiros.
- Inicialização automática dos dados mínimos ao subir a API, caso o banco ainda esteja vazio.
- Upload local de imagens, logomarcas e documentos pelo painel administrativo.

## Upload de arquivos

O painel permite enviar arquivos diretamente do computador para imagens de projetos, campanhas, notícias, galeria, logomarcas de parceiros e documentos de transparência.

- Os arquivos ficam salvos em `server/uploads`.
- A API publica os arquivos em `http://localhost:4000/uploads/nome-do-arquivo`.
- Tipos aceitos: JPG, PNG, WEBP, SVG, PDF, DOC e DOCX.
- Limite por arquivo: 10 MB.
- Esta solução é local e gratuita, adequada para MVP. Em produção, será necessário definir rotina de backup da pasta `server/uploads`.

## Publicação com persistência

Para publicar o projeto mantendo os dados:

1. Configure `DATABASE_PATH` para uma pasta persistente do servidor.
2. Mantenha essa pasta fora do build temporário da aplicação.
3. Faça backup periódico do arquivo `.db`.
4. Mantenha também `server/uploads` em armazenamento persistente, pois ali ficam imagens, logomarcas e documentos enviados pelo painel.

Exemplo de `.env` em produção:

```env
PORT=4000
DATABASE_PATH=/var/www/asp/database/site.db
JWT_SECRET=troque-por-uma-chave-forte
ADMIN_EMAIL=admin@asp.org.br
ADMIN_PASSWORD=uma-senha-forte
```

Em hospedagens com disco efêmero, use o volume persistente oferecido pela plataforma e aponte `DATABASE_PATH` para esse volume.

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

## Fora do escopo do MVP

Este projeto não implementa pagamento online, checkout, gateway de doação, gestão financeira, estoque, cadastro de famílias ou controle de doadores.

As campanhas e metas servem para apresentação institucional e conversão para WhatsApp. A forma de apoio deve ser combinada diretamente com a ONG.

## Evoluções futuras

- Recuperação de senha e gestão de múltiplos usuários administrativos.
- Publicação de relatórios reais em PDF.
- Métricas consolidadas de famílias atendidas.
- Área de relatos com autorização formal de uso de imagem e nome.
- Deploy em servidor institucional e backups automáticos do SQLite.
