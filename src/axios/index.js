/* eslint-disable */
import axios from 'axios'

axios.defaults.baseURL = 'localhost:8001' /* your back-stage API URL */
axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
  if (config.data instanceof Object) config.headers['content-type'] = 'application/json;charset=UTF-8'
  if (config.data instanceof Blob) return config// config.headers['content-type'] = 'application/octet-stream'
  if (config.data instanceof FormData) config.headers['content-type'] = 'multipart/form-data'
  return config
}, error => {
  Promise.reject(error)
})
export default axios
