import Axios from 'axios'
import { isDevelopment } from '.'

export const axios = Axios.create({
  baseURL: isDevelopment ? 'http://localhost:8000/' : 'http://207.154.213.120/',
  // baseURL: process.env.ELECTRON_WEBPACK_APP_BACKEND_URL,
  validateStatus: status => status >= 200 && status < 500,
})
