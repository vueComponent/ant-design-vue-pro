import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // console.log('login enter')
      return new Promise((resolve, reject) => {
        // console.log('login promise')
        login(userInfo).then(response => {
          if(!response.data){
            reject(response)
          }else{
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result, 2 * 60 * 60 * 1000) //2小时过期
            commit('SET_TOKEN', result)
            resolve()
          }         
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit } ,role) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', role)
        resolve()
      })
    },

    // 登出
    Logout({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        logout().then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    }

  }
}

export default user