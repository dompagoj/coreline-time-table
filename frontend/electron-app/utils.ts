import { readFile, writeFile } from 'fs'
import { decode } from 'jsonwebtoken'

export async function saveToken(path: string, token) {
  writeFile(`${path}/auth`, token, err => {
    if (err) {
      throw new Error('Failed to write token')
    }
  })
}

export async function readToken(path: string) {
  return new Promise((resolve, reject) => {
    readFile(`${path}/auth`, (err, data) => {
      if (err) {
        throw new Error('Failed to read token')
      }

      const tokenData = decode(data.toString('utf-8'), { json: true })
      if (tokenData) {
        resolve(tokenData)
      } else {
        reject(new Error('Error while reading token'))
      }
    })
  })
}
