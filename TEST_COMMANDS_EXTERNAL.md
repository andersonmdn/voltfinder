# Guia de Comandos de Teste Vitest - VoltFinder API (Testes Externos)

## 🧪 Configuração de Testes Externos

Os testes foram configurados para se conectar a uma **API externa em execução**, não iniciando uma nova instância do servidor para cada teste.

### 📋 Pré-requisitos

1. **API deve estar rodando**: `pnpm dev:api`
2. **Arquivo .env.test configurado** em `apps/api/.env.test`:
   ```env
   NODE_ENV=test
   API_BASE_URL=http://localhost:3333
   DATABASE_URL=postgresql://user:password@localhost:5432/voltfinder_test
   JWT_SECRET=test-jwt-secret-key
   ```

### 🚀 Como Executar

```bash
# 1. Primeiro, inicie a API em um terminal
pnpm dev:api

# 2. Em outro terminal, execute os testes
pnpm test:api:run          # Execução única
pnpm test:api:watch        # Modo watch
pnpm test:api:ui           # Interface gráfica
```

## 📋 Comandos de Teste Configurados

### 📁 Comandos do Diretório Raiz

```bash
# Testes básicos (uma execução)
pnpm test:api                  # Executa todos os testes da API
pnpm test:api:run              # Executa testes uma vez e para

# Testes em modo watch (desenvolvimento)
pnpm test:api:watch            # Executa testes e re-executa quando arquivos mudam

# Interface gráfica do Vitest
pnpm test:api:ui               # Abre interface gráfica do Vitest no navegador

# Cobertura de código
pnpm test:api:coverage         # Executa testes e gera relatório de cobertura
```

### 📁 Comandos na Pasta `apps/api`

```bash
# Navegue para a pasta da API
cd apps/api

# Comandos diretos do Vitest
vitest                         # Executa testes em modo watch
vitest --ui                    # Abre interface gráfica
vitest run                     # Executa uma vez e para
vitest --coverage              # Executa com cobertura
vitest auth.test.ts            # Executa apenas testes de auth
vitest stations.test.ts        # Executa apenas testes de stations
vitest services.test.ts        # Executa apenas testes de integração

# Comandos específicos do package.json
pnpm test                      # Modo watch
pnpm test:ui                   # Interface gráfica
pnpm test:run                  # Execução única
pnpm test:watch                # Modo watch explícito
pnpm test:coverage             # Com cobertura
```

## 🗂️ Estrutura de Testes Criada

```
apps/api/
├── .env.test                  # Variáveis de ambiente para testes
└── src/test/
    ├── helpers/
    │   └── apiClient.ts       # Cliente HTTP para testes externos
    ├── setup.ts               # Configuração e verificação da API
    ├── auth.test.ts           # Testes das rotas de autenticação
    ├── stations.test.ts       # Testes das rotas de estações
    └── services.test.ts       # Testes de integração da API
```

## 📝 Arquivos de Teste

### 1. **helpers/apiClient.ts**

- Cliente HTTP personalizado para requisições à API externa
- Helpers para GET, POST, PUT, DELETE, PATCH
- Verificação de saúde da API
- Tratamento de erros de conexão

### 2. **setup.ts**

- Carregamento de variáveis de ambiente de teste (.env.test)
- Verificação se a API está rodando antes dos testes
- Logs informativos sobre a configuração

### 3. **auth.test.ts**

- Testes de registro de usuário via HTTP
- Testes de login via HTTP
- Validação de dados de entrada
- Testes de autenticação
- Uso de timestamps para evitar conflitos de dados

### 4. **stations.test.ts**

- Testes de listagem de estações via HTTP
- Testes de criação de estações via HTTP
- Testes de busca por ID via HTTP
- Testes de autorização com tokens JWT

### 5. **services.test.ts**

- Testes de integração da API
- Verificação do endpoint de saúde
- Testes de CORS e headers
- Validação de tratamento de erros

## 🔧 Configuração

### .env.test (apps/api/.env.test)

```env
NODE_ENV=test
API_BASE_URL=http://localhost:3333
DATABASE_URL=postgresql://user:password@localhost:5432/voltfinder_test
JWT_SECRET=test-jwt-secret-key
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

## 🚀 Fluxo de Trabalho

### Desenvolvimento Diário

```bash
# Terminal 1: API rodando
pnpm dev:api

# Terminal 2: Testes em watch ou UI
pnpm test:api:watch    # ou
pnpm test:api:ui       # Interface gráfica (recomendado!)
```

### CI/CD ou Verificação Final

```bash
# Certifique-se que a API está rodando, depois:
pnpm test:api:run              # Execução única
pnpm test:api:coverage         # Com cobertura
```

### Teste Específico

```bash
# Com a API rodando, execute teste específico:
cd apps/api
vitest auth.test.ts --run
```

## 🌐 Interface Gráfica

Para abrir a interface gráfica do Vitest:

```bash
# Com a API rodando:
pnpm test:api:ui
```

A interface abrirá automaticamente no navegador e oferece:

- ✅ Visualização em tempo real dos testes
- 📊 Relatórios detalhados
- 🔍 Filtros por arquivo/teste
- 📈 Gráficos de cobertura
- 🎯 Debug interativo

## ⚡ Vantagens da Abordagem Externa

### ✅ **Benefícios**

- **Testes mais realistas**: Testa a API como ela realmente roda
- **Sem overhead**: Não precisa inicializar servidor para cada teste
- **Isolamento**: Testa contra o ambiente real de desenvolvimento
- **Performance**: Mais rápido que inicializar servidor a cada execução
- **Flexibilidade**: Pode testar contra diferentes ambientes (dev, staging)

### 🔧 **Requisitos**

- API deve estar rodando (`pnpm dev:api`)
- Arquivo `.env.test` configurado
- Banco de dados de teste disponível

## 🐛 Verificação de Problemas

Se os testes falharem com erro de conexão:

1. **Verifique se a API está rodando**:

   ```bash
   curl http://localhost:3333/health
   ```

2. **Verifique o arquivo .env.test**:

   ```bash
   cat apps/api/.env.test
   ```

3. **Verifique as variáveis de ambiente**:
   Os testes mostrarão a URL base que estão tentando acessar

## 📊 Dados de Teste

- **Emails únicos**: Usa timestamps para evitar conflitos
- **Cleanup automático**: Logs informativos sobre limpeza
- **Isolamento**: Cada teste usa dados únicos

## 🔄 Exemplo de Execução

```bash
# Terminal 1
pnpm dev:api

# Terminal 2
pnpm test:api:ui

# Saída esperada:
🧪 Setting up tests...
📡 API Base URL: http://localhost:3333
✅ API is running and accessible
🔐 Setting up Auth tests...
🏗️ Setting up Station tests...
```

---

**💡 Dica**: Mantenha sempre a API rodando em um terminal e use `pnpm test:api:ui` em outro para uma experiência de desenvolvimento visual e interativa!
