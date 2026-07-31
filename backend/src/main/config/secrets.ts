import fs from 'fs'

export class Secrets {
  static read(secretNameAndPath?: string): string | null {
    try {
      if (!secretNameAndPath) return null
      return fs.readFileSync(secretNameAndPath, 'utf8')
    } catch (e) {
      const error = e as Error
      if (error.name !== 'ENOENT') {
        console.error(`Error reading the secret: ${secretNameAndPath}. Err: ${error.message}`)
      } else {
        console.debug(`Could not find the secret: ${secretNameAndPath}. Err: ${error.message}`)
      }
      return null
    }
  }
}
