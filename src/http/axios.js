import axios from 'axios'

// axios.defaults.baseURL = 'http://zhaojinxing.leanapp.cn/wechatAPI'
axios.defaults.baseURL = 'http://101.132.37.149/wechatAPI'
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log('axios request config', config)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

axios.interceptors.response.use(function (config) {
  return config
}, function (err) {
  console.log(err)
  return Promise.reject(err)
})

export default axios
