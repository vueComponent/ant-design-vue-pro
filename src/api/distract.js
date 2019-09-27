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



