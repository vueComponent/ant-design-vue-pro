import api from './index'
import { axios } from '@/utils/request'

export function getVisitTask(params) {
  return axios({
    url: '/visitTask/getDataList',
    method: 'post',
    data: params
  })
 }
 export function ignoreTask(params) {
   return axios({
     url: '/visitTask/ignoreTask',
     method: 'post',
     data: params
   })
  }