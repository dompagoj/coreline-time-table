import Axios from 'axios'
import { BrowserWindow } from 'electron'
import { stringify } from 'querystring'
import { parse } from 'url'

import { LoginResponse } from '../renderer/types/login-response'
import { axios } from './axios'

const isDevelopment = process.env.NODE_ENV !== 'production'

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://www.googleapis.com/oauth2/v4/token'
const GOOGLE_REDIRECT_URI = isDevelopment ?
'coreline.time.table:localhost:8000'
:
'coreline.time.table:207.154.213.120'
const GOOGLE_CLIENT_ID = '252217239009-2ud4h9klfmf8j8kl6lrtfrt677u9tl59.apps.googleusercontent.com'

export async function googleSignIn() {
  const code = await signInWithPopup()
  const { id_token: googleToken } = await fetchAccessTokens(code)

  return signIn(googleToken)
}

function signInWithPopup() {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
    })

    const urlParams = {
      response_type: 'code',
      redirect_uri: GOOGLE_REDIRECT_URI,
      client_id: GOOGLE_CLIENT_ID,
      scope: 'profile email',
    }
    const authUrl = `${GOOGLE_AUTHORIZATION_URL}?${stringify(urlParams)}`

    function handleNavigation(url) {
      const query = parse(url, true).query
      if (query) {
        if (query.error) {
          reject(new Error(`There was an error: ${query.error}`))
        } else if (query.code) {
          authWindow.removeAllListeners('closed')
          setImmediate(() => authWindow.close())

          resolve(query.code)
        }
      }
    }

    authWindow.on('closed', () => {
      throw new Error('Auth window closed by user')
    })

    authWindow.webContents.on('will-navigate', (event, url) => {
      handleNavigation(url)
    })
    // @ts-ignore
    authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      handleNavigation(newUrl)
    })

    authWindow.loadURL(authUrl)
  })
}

async function fetchAccessTokens(code) {
  const response = await Axios.post(
    GOOGLE_TOKEN_URL,
    stringify({
      code,
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  return response.data
}

async function signIn(googleToken): Promise<LoginResponse> {
 return axios.post('auth/login', { googleToken })
}
