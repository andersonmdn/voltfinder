# Port Manager Script

Este script verifica se a porta do servidor está ocupada e oferece opções para lidar com conflitos de porta de forma inteligente.

## ✨ Funcionalidades

- ✅ **Verificação automática de porta**: Detecta se a porta configurada está disponível
- 🔍 **Identificação de processos**: Mostra nome e PID do processo que ocupa a porta
- ⚡ **Finalização inteligente**: Oferece opção para finalizar processo conflitante
- 🔄 **Sugestão de portas**: Encontra automaticamente próxima porta disponível
- 🚀 **Inicialização automática**: Inicia o servidor após resolver conflitos
- 🎯 **Contexto correto**: Executa sempre no diretório correto da API

## 🚀 Como usar

### Opção 1: Script seguro (recomendado)

```bash
# Na raiz do projeto
pnpm dev:api:safe

# Ou diretamente na pasta da API
cd apps/api
pnpm dev:safe
```

### Opção 2: Script tradicional

```bash
# Se você tem certeza que a porta está livre
pnpm dev:api
```

### Opção 3: Execução direta

```bash
# A partir de qualquer lugar
node "C:\Development\voltfinder\apps\api\scripts\check-port.js"
```

## ⚙️ Configuração

O script usa a variável de ambiente `PORT` ou a porta padrão `3000`. Configure no arquivo `.env`:

```env
PORT=3000
HOST=0.0.0.0
```

## 📋 Cenários de Uso

### 1. 🟢 Porta Livre

```
🔍 Verificando se a porta 3000 está disponível...
✅ Porta 3000 está disponível! Iniciando servidor...
🚀 Servidor iniciando...
```

### 2. 🔴 Porta Ocupada - Finalizar Processo

```
🔍 Verificando se a porta 3000 está disponível...
❌ Porta 3000 está ocupada!
📋 Processo encontrado: node.exe (PID: 12345)
❓ Deseja finalizar o processo "node.exe" (PID: 12345)? (s/n): s
✅ Processo 12345 finalizado com sucesso!
🚀 Porta 3000 agora está disponível! Iniciando servidor...
```

### 3. 🔄 Porta Ocupada - Usar Alternativa

```
🔍 Verificando se a porta 3000 está disponível...
❌ Porta 3000 está ocupada!
📋 Processo encontrado: chrome.exe (PID: 9876)
❓ Deseja finalizar o processo "chrome.exe" (PID: 9876)? (s/n): n
🔍 Procurando por uma porta disponível...
💡 Porta 3001 está disponível!
❓ Deseja iniciar o servidor na porta 3001? (s/n): s
🚀 Iniciando servidor na porta 3001...
```

### 4. ❓ Processo Não Identificado

```
🔍 Verificando se a porta 3000 está disponível...
❌ Porta 3000 está ocupada!
❓ Não foi possível identificar o processo que está usando a porta 3000.
🔍 Procurando por uma porta disponível...
💡 Porta 3001 está disponível!
❓ Deseja iniciar o servidor na porta 3001? (s/n): s
🚀 Iniciando servidor na porta 3001...
```

## 🛠️ Arquitetura Técnica

### Estrutura do Script

```
apps/api/scripts/
├── check-port.js    # Script principal de verificação
├── test-server.js   # Servidor de teste para simulações
└── README.md        # Esta documentação
```

### Dependências

O script usa apenas módulos nativos do Node.js:

- `child_process` - Para executar comandos do sistema
- `readline` - Para interação com usuário
- `net` - Para verificar disponibilidade de porta

### Comandos do Sistema (Windows)

- `netstat -ano | findstr :PORT` - Encontra processo na porta
- `tasklist /FI "PID eq PID"` - Obtém nome do processo
- `taskkill /F /PID PID` - Finaliza processo por PID

## 🎨 Interface Visual

O script fornece feedback visual com emojis para melhor UX:

| Emoji | Significado            |
| ----- | ---------------------- |
| 🔍    | Verificando/Procurando |
| ✅    | Sucesso/Disponível     |
| ❌    | Erro/Conflito          |
| 📋    | Informação do processo |
| ❓    | Pergunta ao usuário    |
| 💡    | Sugestão/Dica          |
| 🚀    | Iniciando servidor     |
| ⚠️    | Aviso                  |
| ⏹️    | Operação cancelada     |

## 🔧 Scripts Disponíveis

| Comando             | Descrição                                      |
| ------------------- | ---------------------------------------------- |
| `pnpm dev:api:safe` | Inicia API com verificação de porta (raiz)     |
| `pnpm dev:safe`     | Inicia API com verificação de porta (apps/api) |
| `pnpm dev:api`      | Inicia API diretamente (raiz)                  |
| `pnpm dev`          | Inicia API diretamente (apps/api)              |

## ⚠️ Limitações

- **Compatibilidade**: Atualmente otimizado para Windows
- **Privilégios**: Pode precisar de permissões para finalizar alguns processos
- **Processos do sistema**: Alguns processos não podem ser finalizados

## 🔮 Melhorias Futuras

- [ ] Suporte para Linux/macOS
- [ ] Lista de processos "seguros" para finalizar
- [ ] Histórico de portas usadas
- [ ] Configuração de range de portas
- [ ] Interface web para gerenciamento
- [ ] Integração com Docker containers
