export const serviceName = process.env.SERVICE_NAME || ''

export const containerName = process.env.HOSTNAME || 'host'
export const hostName = process.env.INSTANCE || 'hostname'
export const logToFile = process.env.LOG_TO_FILE === 'true'
export const enableDebug = process.env.DEBUG_LEVEL_LOG === 'true'

export const jwksWellKnownUrl = process.env.JWKS_WELL_KNOWN_URL || ''
export const sqliteDatabasePath = process.env.SQLITE_DATABASE_PATH || './database.sqlite'
