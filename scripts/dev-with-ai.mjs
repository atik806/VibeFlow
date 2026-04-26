import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const webRoot = path.resolve(__dirname, '..')
const apiRoot = path.resolve(webRoot, '..', 'Object Detection')

const isWindows = process.platform === 'win32'
const pythonInVenv = path.join(apiRoot, '.venv', 'Scripts', 'python.exe')

const children = []

function run(name, command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: options.cwd || webRoot,
    env: process.env,
    stdio: 'inherit',
    shell: Boolean(options.shell),
  })
  children.push(child)

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[${name}] exited with code ${code ?? 'unknown'}`)
    }
  })

  child.on('error', (err) => {
    console.error(`[${name}] failed to start: ${err.message}`)
  })

  return child
}

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM')
  }
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('exit', shutdown)

// Start frontend
if (isWindows) {
  run('web', 'cmd.exe', ['/d', '/s', '/c', 'npm run dev:web'], { cwd: webRoot, shell: false })
} else {
  run('web', 'npm', ['run', 'dev:web'], { cwd: webRoot, shell: false })
}

// Start object detection backend
const backendArgs = ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000', '--reload']
if (isWindows) {
  if (fs.existsSync(pythonInVenv)) {
    run('api', pythonInVenv, backendArgs, { cwd: apiRoot, shell: false })
  } else {
    // Fallback for machines using global Python launcher.
    run('api', 'py', backendArgs, { cwd: apiRoot, shell: false })
  }
} else {
  run('api', 'python3', backendArgs, { cwd: apiRoot, shell: false })
}
