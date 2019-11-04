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