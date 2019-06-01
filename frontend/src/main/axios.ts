import Axios from 'axios'
import { ipcRenderer } from 'electron'
import isDev from 'electron-is-dev'

export const axios = Axios.create({
  baseURL: isDev ? 'http://localhost:8000/' : 'http://35.234.98.127/',
  validateStatus: status => status >= 200 && status < 500,
})
axios.interceptors.response.use(response => {
  if (response.data && response.data.error === 'Invalid token') {
    ipcRenderer.send('logout')
  }

  return response
})
