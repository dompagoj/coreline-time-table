import Axios from 'axios'
import { readFile, writeFile } from 'fs'
import { decode } from 'jsonwebtoken'

export async function saveToken(path: string, user) {
  const { data, status } = await Axios.post('http://localhost:8000/auth/login', user)
  writeFile(`${path}/auth`, data, err => {
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
