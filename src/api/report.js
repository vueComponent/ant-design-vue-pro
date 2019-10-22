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

//添加报告
export function createReport(parameter) {
  return axios({
    url: '/reportCollectBase/createReport',
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

//ocr识别
export function ocrResult(parameter) {
  return axios({
    url: '/reportCollectBase/ocrResult',
    method: 'post',
    params: parameter
  })
}

export function getReportType(parameter) {
  return axios({
    url: '/reportCollectBase/getReportType',
    method: 'post'
  })
}


