import { axios } from '@/utils/request'

const api = {
  reportCollectBase: '/reportCollectBase'
}

export default api


export function getReportList (parameter) {
  return axios({
    url: '/reportCollectBase/getDataList',
    method: 'post',
    params: parameter
  })
}

export function getReportCollect () {
  return axios({
    url: '/reportCollectBase/getReportCollect',
    method: 'post'
  })
}
//提交患者信息
export function addOrUpdate(parameter) {
  return axios({
    url: '/reportCollectBase/addOrUpdate',
    method: 'post',
    params: parameter
  })
}
//添加报告
export function addReportCollect(parameter) {
  return axios({
    url: '/reportCollectBase/addReportCollect',
    method: 'post',
    params: parameter
  })
}
//根据用户id获得用户自身带有的选项
export function getChooseReportCollect(parameter) {
  return axios({
    url: '/reportCollectBase/getChooseReportCollect',
    method: 'post',
    params: parameter
  })
}




