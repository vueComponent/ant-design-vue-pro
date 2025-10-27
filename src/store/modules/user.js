import storage from 'store'
// logout
import { login, getInfo, loginOut } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { version } from '@/api/public'
// import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    versionData: {}
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
    },
    SET_VERSION: (state, versionData) => {
      state.versionData = versionData
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === 0) {
            const result = response.result
            // 登录成功设置token
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 获取个人信息
        getInfo().then(response => {
          const result = response.result
          if (response.code === 0 && result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => { return action.action })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            // alert('result.role' + JSON.stringify(response.role))
            // alert('result' + JSON.stringify(result))
            // console.log('src/store/modules/user GetInfo SET_ROLES：', JSON.stringify(response.result.role))
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
          commit('SET_NAME', { name: result.name, welcome: '' })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        loginOut(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
          resolve()
        }).catch((err) => {
          // console.log('logout fail:', err)
          resolve(err)
        }).finally(() => {
        })
      })
    },
    Monitor ({ commit }) {
      version().then(res => {
        if (res.code === 0) {
          commit('SET_VERSION', res)
        }
      })
      /*
      setInterval(() => {
        GetConfig().then(res => {
          if (res.code === 0) {
            commit('SET_REMIND_SWITCH', res.result)
          }
        })
      }, 50 * 1000)
      */
    }
  }
}

export default user
