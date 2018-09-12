import axios from 'axios'
import store from '../store'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'


// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 5000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    if (error.status === 403) {
      notification.error({ message: '拒绝访问', description: '无权限，拒绝访问' })
    }
    if (error.status === 401) {
      notification.error({ message: '未授权', description: '授权验证失败' })
      store.dispatch('Logout').then(() => {
        location.reload()
      })
    }
  }
  return Promise.reject(error)
};

// request 拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers[ 'Access-Token' ] = store.getters.token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response 拦截器
service.interceptors.response.use((response) => {
    return response.data
  }, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}