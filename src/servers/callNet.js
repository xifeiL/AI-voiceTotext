import axios from "axios"

const baseURL = 'http://120.26.248.174:8007'
const timeout = 1000 * 60
const service = axios.create({
  baseURL,
  timeout,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject("请求出错")
    } else {
      // 有错误才反detail
      if (response?.data?.detail) {
        return Promise.reject("请求出错")
      } else {
        return response.data
      }
    }
  },
  error => {
    // 统一错误处理[1,6](@ref)
    const statusMap = {
      400: '参数错误',
      401: '登录过期',
      404: '地址错误',
      500: '服务器错误',
    }
    const msg = statusMap[error.response?.status] || '网络异常'
    console.error(`请求异常：${msg}`)
    return Promise.reject(msg)
  }
)


const callNet = {
  get(url, params) {
    return service({ url, method: 'get', params })
  },
  post(url, data) {
    return service({ url, method: 'post', data })
  },
  upload(url, file, otherData = {}) { // 文件上传专用
    const formData = new FormData()
    formData.append('file', file)
    for (let key in otherData) {
      formData.append(key, otherData[key])
    }
    return service.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}


export default callNet