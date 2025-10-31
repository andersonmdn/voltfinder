# Guia de Comandos de Teste Vitest - VoltFinder API

## 🧪 Comandos de Teste Configurados

### 📋 Comandos do Diretório Raiz

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
vitest services.test.ts        # Executa apenas testes de serviços

# Comandos específicos do package.json
pnpm test                      # Modo watch
pnpm test:ui                   # Interface gráfica
pnpm test:run                  # Execução única
pnpm test:watch                # Modo watch explícito
pnpm test:coverage             # Com cobertura
```

## 🗂️ Estrutura de Testes Criada

```
apps/api/src/test/
├── setup.ts                  # Configuração de setup dos testes
├── auth.test.ts               # Testes das rotas de autenticação
├── stations.test.ts           # Testes das rotas de estações
└── services.test.ts           # Testes dos serviços (AuthService, StationService)
```

## 📝 Arquivos de Teste

### 1. **setup.ts**

- Configuração do ambiente de teste
- Setup do banco de dados de teste
- Execução de migrações

### 2. **auth.test.ts**

- Testes de registro de usuário
- Testes de login
- Validação de dados de entrada
- Testes de autenticação

### 3. **stations.test.ts**

- Testes de listagem de estações
- Testes de criação de estações
- Testes de busca por ID
- Testes de autorização

### 4. **services.test.ts**

- Testes unitários dos serviços
- Testes de validação de dados
- Testes de regras de negócio

## 🔧 Configuração

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

## 🚀 Como Usar

### Desenvolvimento Diário

```bash
# Para desenvolvimento contínuo (reexecuta automaticamente)
pnpm test:api:watch

# Para visualização gráfica (mais amigável)
pnpm test:api:ui
```

### CI/CD ou Verificação Final

```bash
# Para execução única (ideal para CI/CD)
pnpm test:api:run

# Para verificar cobertura de código
pnpm test:api:coverage
```

### Teste Específico

```bash
# Navegar para apps/api e executar teste específico
cd apps/api
vitest auth.test.ts --run
```

## 🌐 Interface Gráfica

Para abrir a interface gráfica do Vitest:

```bash
pnpm test:api:ui
```

A interface abrirá automaticamente no navegador (geralmente `http://localhost:51204`) e oferece:

- ✅ Visualização em tempo real dos testes
- 📊 Relatórios detalhados
- 🔍 Filtros por arquivo/teste
- 📈 Gráficos de cobertura
- 🎯 Debug interativo

## 🐛 Problemas Identificados nos Testes

Durante a execução, foram identificados alguns problemas que precisam ser corrigidos:

1. **Rotas não encontradas (404)** - Prefixos de rota incorretos
2. **Problemas de banco de dados** - URL de conexão de teste
3. **Schemas de validação** - Alguns campos não estão sendo validados corretamente
4. **Erros de serialização** - Problemas com schemas de resposta

## 📊 Estatísticas dos Testes

- **Total de testes**: 27
- **Testes aprovados**: 7
- **Testes falhando**: 18
- **Arquivos de teste**: 3
- **Tempo de execução**: ~4.4s

## 🔄 Próximos Passos

1. Corrigir os prefixos das rotas nos testes
2. Configurar banco de dados de teste adequado
3. Ajustar schemas de validação
4. Implementar mocks para testes mais isolados
5. Adicionar testes de integração
6. Configurar coverage thresholds

---

**💡 Dica**: Use `pnpm test:api:ui` para uma experiência de desenvolvimento mais visual e interativa!
