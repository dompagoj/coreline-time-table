import { app } from 'electron'
import { readFile, unlink, writeFile } from 'fs'

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
        resolve(undefined)
      }
      if (data) {
        resolve(data.toString('utf-8'))
      }
      reject(new Error('Error while reading token'))
    })
  })
}

export async function deleteToken(): Promise<any> {
  return new Promise((resolve, reject) => {
    unlink(`${app.getPath('userData')}/auth`, err => {
      if (err) {
        reject(err)
      }
      resolve(true)
    })
  })
}
