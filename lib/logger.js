const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 }
const currentLevel = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info

function log(level, msg, meta) {
  if (LEVELS[level] > currentLevel) return
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message: msg,
    ...(meta ? { ...meta } : {}),
  })
  if (level === 'error') console.error(entry)
  else if (level === 'warn') console.warn(entry)
  else console.log(entry)
}

export const logger = {
  info: (msg, meta) => log('info', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  error: (msg, meta) => log('error', msg, meta),
  debug: (msg, meta) => log('debug', msg, meta),
}
