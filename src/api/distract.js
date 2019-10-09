import { axios } from '@/utils/request'

const api = {
    distract: '/distract'
}

export default api


export function getZyDataList (parameter) {
  return axios({
    url: '/distract/getZyDataList',
    method: 'post',
    params: parameter
  })
}

export function addDistract (parameter) {
  return axios({
    url: '/distract/addDistract',
    method: 'post',
    params: parameter
  })
}

export function getSqDataList (parameter) {
    return axios({
      url: '/distract/getSqDataList',
      method: 'post',
      params: parameter
    })
  }

  export function verifyDistract (parameter) {
    return axios({
      url: '/distract/verifyDistract',
      method: 'post',
      params: parameter
    })
  }


