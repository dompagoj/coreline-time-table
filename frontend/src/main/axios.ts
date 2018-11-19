import Axios from 'axios'

export const axios = Axios.create({
  baseURL: process.env.ELECTRON_WEBPACK_APP_BACKEND_URL,
  validateStatus: status => status >= 200 && status < 500,
})
