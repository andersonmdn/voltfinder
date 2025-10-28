# VoltFinder ⚡

Este é um monorepo construido para um projeto colaborativo do Pipoca Ágil

### 🔋 API Backend

- **URL**: http://localhost:3000
- **Documentação**: http://localhost:3000/docs (Swagger UI)
- **Health Check**: http://localhost:3000/health
- **Banco**: PostgreSQL

### 📱 Mobile App

- **Framework**: React Native + Expo + Tamagui
- **Estado**: Configurado e pronto para desenvolvimento
- **Integração**: Preparado para conectar com a API

## 🚀 Quick Start

### Pré-requisitos

- Node.js (>= 18.x)
- pnpm (>= 8.x)
- PostgreSQL ou Docker (Pendente)

### Instalação Rápida

```bash
# 1. Instalar dependências
pnpm install

# 2. Iniciar banco PostgreSQL

## Opção 1: Comando Simples (Recomendado)
pnpm docker:postgres

## Opção 2: Docker Run direto
docker run --name voltfinder-postgres -e POSTGRES_PASSWORD=sql -p 5433:5432 -d postgres:16

## Opção 3: Docker Compose (se preferir)
docker-compose up -d postgres

# 3. Configurar banco
cd apps/api
pnpm prisma generate
pnpm prisma db push

# 4. Executar API (modo seguro - recomendado)
pnpm dev:api:safe

# Ou modo tradicional
pnpm dev:api
```

### ⚡ Script de Verificação de Porta

O projeto inclui um script inteligente que verifica conflitos de porta antes de iniciar o servidor:

```bash
# Modo seguro (recomendado) - verifica porta e resolve conflitos
pnpm dev:api:safe

# Se a porta 3000 estiver ocupada, o script irá:
# 1. Identificar qual processo está usando a porta
# 2. Oferecer opção para finalizar o processo
# 3. Sugerir portas alternativas se necessário
# 4. Iniciar automaticamente o servidor
```

**Exemplo de uso:**

```
🔍 Verificando se a porta 3000 está disponível...
❌ Porta 3000 está ocupada!
📋 Processo encontrado: node.exe (PID: 12345)
❓ Deseja finalizar o processo "node.exe" (PID: 12345)? (s/n): s
✅ Processo 12345 finalizado com sucesso!
🚀 Iniciando servidor na porta 3000...
```

## 🐳 Docker

### Execução Completa com Docker

Para uma configuração completa e isolada usando Docker:

```bash
# Iniciar tudo (PostgreSQL + Migrações + API)
pnpm docker:full:build    # Primeira vez (com build)
pnpm docker:full          # Execuções posteriores

# Apenas a API (se PostgreSQL já estiver rodando)
pnpm docker:api

# Build da API
pnpm docker:api:build

# Ver logs da API
pnpm docker:api:logs

# Parar todos os serviços
docker compose down
```

**Endpoints disponíveis:**

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/docs
- **Health**: http://localhost:3000/health
- **PostgreSQL**: localhost:5433

### PostgreSQL com Docker

O projeto oferece três maneiras de executar o PostgreSQL com Docker:

#### 1. Comando Simples (Recomendado)

```bash
# Iniciar PostgreSQL
pnpm docker:postgres

# Parar PostgreSQL
pnpm docker:postgres:stop

# Ver logs
pnpm docker:postgres:logs

# Limpar container (para reiniciar do zero)
pnpm docker:postgres:clean
```

#### 2. Docker Run direto

```bash
# Comando direto (PostgreSQL 16)
docker run --name voltfinder-postgres -e POSTGRES_PASSWORD=sql -p 5433:5432 -d postgres:16

# Parar e remover
docker stop voltfinder-postgres
docker rm voltfinder-postgres
```

#### 3. Docker Compose (alternativa)

```bash
# Iniciar apenas o PostgreSQL
docker-compose up -d postgres

# Parar o serviço
docker-compose down

# Verificar logs
docker-compose logs postgres

# Remover volumes (CUIDADO: apaga dados!)
docker-compose down -v
```

#### 2. Build personalizado + Run

```bash
# Build da imagem personalizada
docker build -f Dockerfile.postgres -t voltfinder-postgres .

# Executar container
docker run --name voltfinder-postgres \
  -e POSTGRES_PASSWORD=sql \
  -p 5433:5432 \
  -d voltfinder-postgres

# Parar e remover
docker stop voltfinder-postgres
docker rm voltfinder-postgres
```

#### 3. Docker Run direto (comando original)

```bash
# Comando original (usando imagem oficial do PostgreSQL)
docker run --name voltfinder-postgres -e POSTGRES_PASSWORD=sql -p 5433:5432 -d postgres
```

### Configurações do Banco

- **Host**: localhost
- **Porta**: 5433
- **Usuário**: postgres
- **Senha**: sql
- **Database**: voltfinder
- **URL de Conexão**: `postgresql://postgres:sql@localhost:5433/voltfinder`

### Comandos Úteis

```bash
# Conectar ao banco via psql
docker exec -it voltfinder-postgres psql -U postgres -d voltfinder

# Backup do banco
docker exec voltfinder-postgres pg_dump -U postgres voltfinder > backup.sql

# Restore do banco
docker exec -i voltfinder-postgres psql -U postgres voltfinder < backup.sql

# Verificar logs do container
docker logs voltfinder-postgres

# Verificar status
docker ps | grep voltfinder-postgres
```

## 🐳 Docker

Comandos simplificados para executar o projeto com Docker:

```bash
# Primeira execução (com build)
pnpm docker:build && pnpm docker:up

# Execuções posteriores
pnpm docker:up

# Ver logs
pnpm docker:logs

# Parar serviços
pnpm docker:down

# Reset completo (⚠️ apaga dados!)
pnpm docker:reset
```

**Endpoints disponíveis:**

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/docs
- **Health**: http://localhost:3000/health
- **PostgreSQL**: localhost:5433

Veja [DOCKER.md](./DOCKER.md) para mais detalhes.

## 📁 Estrutura do Projeto

```
voltfinder/
├── apps/
│   ├── api/           # 🔋 API Backend (Fastify + Prisma)
│   │   ├── src/
│   │   │   ├── routes/    # Rotas com Zod + Swagger
│   │   │   ├── services/  # AuthService + UserService
│   │   │   └── app.ts     # Setup da aplicação
│   │   └── prisma/        # Schema e configurações
│   └── mobile/        # 📱 App Mobile (React Native + Expo)
├── packages/
│   ├── validations/   # 📋 Schemas Zod compartilhados
│   └── core/          # 🛠️ Utilitários compartilhados
└── package.json       # Configuração do workspace
```

## Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd voltfinder
```

2. Instale as dependências:

```bash
pnpm install
```

## Configuração

### API

1. Navegue até a pasta da API:

```bash
cd apps/api
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Configure as variáveis de ambiente no arquivo `.env`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=seu-jwt-secret-super-seguro
DATABASE_URL="postgresql://username:password@localhost:5432/voltfinder?schema=public"
```

4. Configure o banco de dados:

```bash
pnpm db:push
```

### Mobile

A aplicação mobile não requer configuração adicional além da instalação das dependências.

## Executando o Projeto

### Desenvolvimento

Para executar toda a stack em desenvolvimento:

```bash
# Terminal 1 - API
pnpm dev:api

# Terminal 2 - Mobile
pnpm dev:mobile
```

### Comandos Específicos

#### API

```bash
cd apps/api

# Desenvolvimento
pnpm dev

# Build
pnpm build

# Testes
pnpm test

# Banco de dados
pnpm db:generate    # Gerar Prisma Client
pnpm db:push        # Push schema para DB
pnpm db:migrate     # Executar migrações
pnpm db:studio      # Abrir Prisma Studio
```

#### Mobile

```bash
cd apps/mobile

# Desenvolvimento
pnpm dev

# Plataformas específicas
pnpm android
pnpm ios
pnpm web

# Build
pnpm build:android
pnpm build:ios
pnpm build:web
```

#### Packages

```bash
cd packages/validations
# ou
cd packages/core

# Build
pnpm build

# Desenvolvimento (watch mode)
pnpm dev
```

## URLs de Desenvolvimento

- API: http://localhost:3000
- API Docs (Swagger): http://localhost:3000/docs
- Mobile: Configurado via Expo CLI

## Recursos

### API Features

- ✅ Fastify + TypeScript
- ✅ Zod validation
- ✅ Swagger documentation
- ✅ JWT authentication
- ✅ Prisma ORM
- ✅ CORS configurado
- ✅ Estrutura de rotas organizadas

### Mobile Features

- ✅ Expo Router
- ✅ Tamagui UI
- ✅ React Hook Form + Zod
- ✅ TypeScript
- ✅ Navigation estruturada

### Packages

- ✅ **validations**: Schemas Zod compartilhados
- ✅ **core**: Tipos e utilitários compartilhados

## Scripts Globais

```bash
# Desenvolvimento com verificação de porta (recomendado)
pnpm dev:api:safe

# Desenvolvimento tradicional
pnpm dev:api
pnpm dev:mobile

# Build todos os packages
pnpm build

# Executar testes em todos os packages
pnpm test

# Type checking em todos os packages
pnpm type-check

# Docker
pnpm docker:up               # Iniciar todos os serviços
pnpm docker:build            # Build das imagens
pnpm docker:down             # Parar todos os serviços
pnpm docker:logs             # Ver logs
pnpm docker:reset            # Reset completo (⚠️ apaga dados!)
```

### Scripts da API

```bash
cd apps/api

# Desenvolvimento com verificação de porta
pnpm dev:safe

# Desenvolvimento tradicional
pnpm dev

# Build e outros
pnpm build
pnpm test
pnpm type-check

# Banco de dados
pnpm db:generate    # Gerar Prisma Client
pnpm db:push        # Push schema para DB
pnpm db:migrate     # Executar migrações
pnpm db:studio      # Abrir Prisma Studio
```

## Estrutura de Dependências

- **validations**: Independente, apenas Zod
- **core**: Depende de validations
- **api**: Depende de core e validations
- **mobile**: Depende de core e validations

## Tecnologias Utilizadas

### Backend

- Fastify
- Prisma
- PostgreSQL
- Zod
- JWT
- Swagger

### Mobile

- React Native
- Expo
- Tamagui
- React Hook Form
- Expo Router

### Tooling

- TypeScript
- pnpm workspaces
- Vitest
- ESLint

## Próximos Passos

1. Implementar endpoints completos da API
2. Configurar autenticação real
3. Implementar telas do mobile
4. Adicionar testes
5. Configurar CI/CD
6. Deploy production

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
