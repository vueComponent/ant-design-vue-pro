import {
  axios
} from '@/utils/request'

export function getDataList(parameter) {
  return axios({
    url: '/textGwLb/getDataList',
    method: 'get',
    params: parameter
  })
}

export function saveData(data) {
  return axios({
    url: '/textGwLb/save',
    method: 'post',
    data
  })
}