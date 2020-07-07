import api from './index'
import { axios } from '@/utils/request'

export function getVisitTask(parameter) {
  return axios({
    url: '/basis/getFsDataList',
    method: 'post',
    params: parameter
  })
}
export function ignoreTask(parameter) {
  return axios({
    url: '/visitTask/ignoreTask',
    method: 'post',
    params: parameter
  })
}
export function ignoreBNTask(parameter) {
  return axios({
    url: '/basis/ignore',
    method: 'post',
    params: parameter
  })
}