import Axios from 'axios'

export const axios = Axios.create({
  baseURL: 'http://localhost:8000/',
  validateStatus: status => status >= 200 && status < 500,
})
