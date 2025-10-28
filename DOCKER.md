# Docker Setup para VoltFinder

## Modos de Execução

### 🚀 Produção (Padrão)

```bash
# Primeira vez
pnpm docker:build && pnpm docker:up

# Execuções posteriores
pnpm docker:up
```

### 🛠️ Desenvolvimento (Hot Reload)

```bash
# Modo desenvolvimento com hot reload
pnpm docker:dev
```

## Comandos Principais

```bash
# Produção
pnpm docker:up          # Iniciar (produção)
pnpm docker:dev         # Iniciar (desenvolvimento)
pnpm docker:build       # Build das imagens
pnpm docker:logs        # Ver logs
pnpm docker:down        # Parar serviços
pnpm docker:reset       # Reset completo (apaga dados!)
```

## Comandos Disponíveis

- `pnpm docker:up` - Inicia em modo produção
- `pnpm docker:dev` - Inicia em modo desenvolvimento (hot reload)
- `pnpm docker:build` - Build das imagens
- `pnpm docker:down` - Para todos os serviços
- `pnpm docker:logs` - Visualiza logs
- `pnpm docker:reset` - Para e remove volumes (⚠️ **Apaga dados!**)

## Endpoints

Após `pnpm docker:up` ou `pnpm docker:dev`:

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/docs
- **Health**: http://localhost:3000/health
- **PostgreSQL**: localhost:5433

## Troubleshooting

```bash
# Ver status dos containers
docker compose ps

# Ver logs específicos
docker compose logs postgres
docker compose logs api

# Rebuild completo
pnpm docker:reset
pnpm docker:build
pnpm docker:up
```
