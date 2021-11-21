import storage from 'store'
import { loginAdmin, loginOrg, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import bootstrap from '../../core/bootstrap'

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
    // 管理员登录
    LoginAdmin ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginAdmin(userInfo).then(response => {
          console.log('response')
          console.log(response)
          if (response.success === false) {
            console.log('test3')
          }
          const result = response.data
          console.log('login')
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          console.log('token in storage:')
          console.log(storage.get(ACCESS_TOKEN))
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 学生组织登录
    LoginOrg ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginOrg(userInfo).then(response => {
          const result = response.data
          console.log('login')
          storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
          console.log('token in storage:')
          console.log(storage.get(ACCESS_TOKEN))
          commit('SET_TOKEN', result.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      console.log('获取用户信息接口')
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          console.log('getUserInfo')
          console.log(response)
          const result = response.result

          // if (result.role && result.role.permissions.length > 0) {
          //   const role = result.role
          //   role.permissions = result.role.permissions
          //   role.permissions.map(per => {
          //     if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
          //       console.log('1')
          //       const action = per.actionEntitySet.map(action => { return action.action })
          //       per.actionList = action
          //     }
          //   })
          //   console.log('2')
          //   role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          // } else {
          //   reject(new Error('getInfo: roles must be a non-null array !'))
          // }
          console.log('there')
          commit('SET_NAME', { name: result.name, welcome: welcome() })
          commit('SET_AVATAR', result.avatar)
          resolve(response)
        }).catch(error => {
          console.log('error on getInfo')
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.clearAll()
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          bootstrap()
        })
      })
    }

  }
}

export default user
