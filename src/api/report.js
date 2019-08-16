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

export function getReportCollect (parameter) {
  return axios({
    url: '/reportCollectBase/getReportCollect',
    method: 'post'
  })
}
//提交患者信息
export function addOrUpdate(params) {
  return axios({
    url: '/patient/addOrUpdate',
    method: 'post',
    data: params
  })
}


