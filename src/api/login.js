import { axios } from '@/utils/request'

export function login(username, password) {
  return axios({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return axios({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout() {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}