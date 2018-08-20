import axios from 'axios'
import store from '../store'
import { VueAxios } from './axios'

// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api base_url
    timeout: 5000 // 请求超时时间
})

// request 拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers['Access-Token'] = '' // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    return config
}, error => {
    // Do something with request error
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data
        //console.log('[LOG] -> respoinse.use', res)
        if (res.status !== 200) {
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    (error) => {
        if (error.response && error.response.data) {
            const result = error.response.data
            return Promise.reject(result)
        }
        return Promise.reject(error)
    }
)

const installer = {
    vm: {},
    install(Vue, router = {}) {
        Vue.use(VueAxios, router, service)
    }
}

export {
    installer as VueAxios,
    service as axios
}