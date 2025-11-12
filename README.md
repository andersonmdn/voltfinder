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

### Instalação Rápida (🐳 Docker)

```bash
# 1. Instalar dependências
pnpm install

# 2. Setup inicial (API + Postgres + Migrate)
pnpm docker:up

# 3. Encerrar API
pnpm docker:down

# 4. Iniciar apenas Postgres
pnpm docker:postgres

# 4. Executar API
pnpm dev:api

# 5. Executar Mobile (Utilizar Emulador ou instalar o Expo no celular)
pnpm dev:mobile
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

**Endpoints disponíveis:**

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/docs
- **Health**: http://localhost:3000/health

### Configurações do Banco

- **Host**: localhost
- **Porta**: 5433
- **Usuário**: postgres
- **Senha**: sql
- **Database**: voltfinder
- **URL de Conexão**: `postgresql://postgres:sql@localhost:5433/voltfinder`

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

````bash
# Testes
pnpm test:api

# Testes com UI
pnpm test:api:ui

#### Packages
```bash
# Build (Necessário rodar ao realizar mudanças no Packages)
pnpm packages:build
````

### Packages

- ✅ **validations**: Schemas Zod compartilhados
- ✅ **core**: Tipos e utilitários compartilhados
- ✅ **map-core**: Em desenvolvimento...

<!-- ## 🗺️ Map Layer / Camada de Mapas

O VoltFinder inclui uma camada de mapas abstrata que suporta múltiplos provedores:

### Provedores Suportados

1. **Leaflet (Web)** - OpenStreetMap, grátis, sem API key necessária
2. **Google Maps (Web)** - Requer chave API, termos comerciais
3. **React Native Maps (Mobile)** - Google no Android, Apple Maps no iOS

### Configuração Rápida

1. **Copie o arquivo de ambiente:**
```bash
cp .env.example .env
```

2. **Configure o provedor no `.env`:**
```bash
# Para Leaflet (padrão, grátis)
EXPO_PUBLIC_MAP_PROVIDER=leaflet

# Para Google Maps (requer API key)
EXPO_PUBLIC_MAP_PROVIDER=google
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Para React Native Maps (mobile apenas)
EXPO_PUBLIC_MAP_PROVIDER=rn-maps
```

3. **Execute com diferentes provedores:**
```bash
# Web com Leaflet
pnpm dev:web:leaflet

# Web com Google Maps
pnpm dev:web:google

# Mobile (React Native Maps)
pnpm dev:mobile
```

### Obter Chave do Google Maps

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie/selecione um projeto
3. Habilite "Maps JavaScript API"
4. Crie uma chave API em "Credenciais"
5. Configure restrições de domínio/IP (opcional)
6. Adicione a chave no `.env`

### Estrutura dos Packages

```
packages/
  map-core/           # Interface comum (IMapAdapter)
  map-leaflet-web/    # Adapter Leaflet para web
  map-google-web/     # Adapter Google Maps para web
```

### Interface Unificada

Todos os adapters implementam a mesma interface:

```typescript
interface IMapAdapter {
  mount(container: HTMLElement | null): void;
  unmount(): void;
  setCamera(pos: LatLng, zoom: number): void;
  fitBounds(nw: LatLng, se: LatLng, padding?: number): void;
  addMarker(id: string, pos: LatLng, opts?: MarkerOptions): void;
  removeMarker(id: string): void;
  addPolyline(id: string, pts: LatLng[], opts?: PolylineOptions): void;
  addPolygon(id: string, pts: LatLng[], opts?: PolygonOptions): void;
  on(event: 'press' | 'regionChanged', cb: Function): void;
  off(event: 'press' | 'regionChanged', cb: Function): void;
}
```

### Considerações Legais

- **OpenStreetMap (Leaflet)**: Livre, requer attribution
- **Google Maps**: Limites de uso grátis, não cachear tiles
- **React Native Maps**: Apple Maps (iOS) e Google (Android)

⚠️ **IMPORTANTE**: Respeite os termos de uso de cada provedor.

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
- React Native Maps

### Maps

- Leaflet (OpenStreetMap)
- Google Maps JavaScript API
- React Native Maps (iOS/Android)

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
-->
