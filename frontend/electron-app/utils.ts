import { app } from 'electron'
import { readFile, writeFile } from 'fs'

export async function saveToken(token) {
  writeFile(`${app.getPath('userData')}/auth`, token, err => {
    if (err) {
      throw new Error('Failed to write token')
    }
  })
}

export async function readToken(): Promise<any> {
  return new Promise((resolve, reject) => {
    readFile(`${app.getPath('userData')}/auth`, (err, data) => {
      if (err) {
        throw new Error('Failed to read token')
      }
      if (data) {
        resolve(data.toString('utf-8'))
      }
      reject(new Error('Error while reading token'))
    })
  })
}
