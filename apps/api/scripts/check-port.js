#!/usr/bin/env node

const { spawn, exec } = require('child_process')
const readline = require('readline')
const net = require('net')

// Configurações
const DEFAULT_PORT = 3000
const HOST = '0.0.0.0'

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Função para verificar se uma porta está em uso
function isPortInUse(port, host = 'localhost') {
  return new Promise((resolve) => {
    const server = net.createServer()

    server.listen(port, host, () => {
      server.once('close', () => {
        resolve(false) // Porta está livre
      })
      server.close()
    })

    server.on('error', () => {
      resolve(true) // Porta está em uso
    })
  })
}

// Função para encontrar o processo que está usando a porta (Windows)
function findProcessOnPort(port) {
  return new Promise((resolve, reject) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
      if (error) {
        resolve(null)
        return
      }

      const lines = stdout.split('\n').filter((line) => line.trim())
      if (lines.length === 0) {
        resolve(null)
        return
      }

      // Extrair PID da primeira linha encontrada
      const firstLine = lines[0].trim()
      const parts = firstLine.split(/\s+/)
      const pid = parts[parts.length - 1]

      if (pid && pid !== '0') {
        // Buscar nome do processo pelo PID
        exec(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, (error, stdout, stderr) => {
          if (error) {
            resolve({ pid, name: 'Unknown' })
            return
          }

          const processLine = stdout.split('\n')[0]
          if (processLine) {
            const processName = processLine.split(',')[0].replace(/"/g, '')
            resolve({ pid, name: processName })
          } else {
            resolve({ pid, name: 'Unknown' })
          }
        })
      } else {
        resolve(null)
      }
    })
  })
}

// Função para finalizar processo por PID
function killProcess(pid) {
  return new Promise((resolve, reject) => {
    exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
}

// Função para encontrar próxima porta disponível
async function findNextAvailablePort(startPort, host = 'localhost') {
  let port = startPort
  while (port <= 65535) {
    const inUse = await isPortInUse(port, host)
    if (!inUse) {
      return port
    }
    port++
  }
  throw new Error('Nenhuma porta disponível encontrada')
}

// Função para perguntar ao usuário
function askUser(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.toLowerCase().trim())
    })
  })
}

// Função principal
async function main() {
  try {
    const targetPort = process.env.PORT || DEFAULT_PORT

    // Garantir que estamos no diretório correto da API
    const apiDir = __dirname.replace('\\scripts', '').replace('/scripts', '')
    process.chdir(apiDir)

    console.log(`🔍 Verificando se a porta ${targetPort} está disponível...`)

    const portInUse = await isPortInUse(targetPort, HOST)

    if (!portInUse) {
      console.log(`✅ Porta ${targetPort} está disponível! Iniciando servidor...`)
      rl.close()

      // Iniciar o servidor
      const serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true,
        cwd: apiDir,
      })

      serverProcess.on('exit', (code) => {
        process.exit(code)
      })

      return
    }

    console.log(`❌ Porta ${targetPort} está ocupada!`)

    // Encontrar processo que está usando a porta
    const processInfo = await findProcessOnPort(targetPort)

    if (processInfo) {
      console.log(`📋 Processo encontrado: ${processInfo.name} (PID: ${processInfo.pid})`)

      const killAnswer = await askUser(`❓ Deseja finalizar o processo "${processInfo.name}" (PID: ${processInfo.pid})? (s/n): `)

      if (killAnswer === 's' || killAnswer === 'sim' || killAnswer === 'y' || killAnswer === 'yes') {
        try {
          await killProcess(processInfo.pid)
          console.log(`✅ Processo ${processInfo.pid} finalizado com sucesso!`)

          // Aguardar um pouco e verificar novamente
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const stillInUse = await isPortInUse(targetPort, HOST)
          if (!stillInUse) {
            console.log(`🚀 Porta ${targetPort} agora está disponível! Iniciando servidor...`)
            rl.close()

            // Iniciar o servidor
            const serverProcess = spawn('npm', ['run', 'dev'], {
              stdio: 'inherit',
              shell: true,
              cwd: apiDir,
            })

            serverProcess.on('exit', (code) => {
              process.exit(code)
            })

            return
          } else {
            console.log(`⚠️ Porta ${targetPort} ainda está ocupada após finalizar o processo.`)
          }
        } catch (error) {
          console.log(`❌ Erro ao finalizar processo: ${error.message}`)
        }
      }
    } else {
      console.log(`❓ Não foi possível identificar o processo que está usando a porta ${targetPort}.`)
    }

    // Sugerir porta alternativa
    console.log(`🔍 Procurando por uma porta disponível...`)
    try {
      const nextPort = await findNextAvailablePort(parseInt(targetPort) + 1, HOST)
      console.log(`💡 Porta ${nextPort} está disponível!`)

      const useAlternativeAnswer = await askUser(`❓ Deseja iniciar o servidor na porta ${nextPort}? (s/n): `)

      if (useAlternativeAnswer === 's' || useAlternativeAnswer === 'sim' || useAlternativeAnswer === 'y' || useAlternativeAnswer === 'yes') {
        console.log(`🚀 Iniciando servidor na porta ${nextPort}...`)
        rl.close()

        // Iniciar o servidor com a nova porta
        const serverProcess = spawn('npm', ['run', 'dev'], {
          stdio: 'inherit',
          shell: true,
          cwd: apiDir,
          env: { ...process.env, PORT: nextPort.toString() },
        })

        serverProcess.on('exit', (code) => {
          process.exit(code)
        })

        return
      }
    } catch (error) {
      console.log(`❌ Erro ao procurar porta disponível: ${error.message}`)
    }

    console.log(`⏹️ Operação cancelada. Servidor não foi iniciado.`)
    rl.close()
    process.exit(1)
  } catch (error) {
    console.error(`❌ Erro inesperado: ${error.message}`)
    rl.close()
    process.exit(1)
  }
}

// Executar apenas se for chamado diretamente
if (require.main === module) {
  main()
}

module.exports = {
  isPortInUse,
  findProcessOnPort,
  killProcess,
  findNextAvailablePort,
}
