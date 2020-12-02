import { axios } from '@/utils/request'

const api = {
  reportCollectBase: '/reportCollectBase'
}

export default api


export function getReportList(parameter) {
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

export function getReportTypeMark(parameter) {
  return axios({
    url: '/reportCollectBase/getReportTypeMark',
    method: 'post',
    params: parameter
  })
}

export function saveReport(parameter) {
  return axios({
    url: '/reportCollectBase/saveReport',
    method: 'post',
    params: parameter
  })
}

export function getReportFormData(parameter) {
  return axios({
    url: '/reportCollectBase/getReportFormData',
    method: 'post',
    params: parameter
  })
}

export function getImportDataList(parameter) {
  return axios({
    url: '/reportCollectBase/getImportDataList',
    method: 'post',
    params: parameter
  })
}
export function getReporApplyList(params) {
  return axios({
    url: '/reportApply/getDataList',
    method: 'post',
    params: params
  })
}
export function saveReporApply(params) {
  return axios({
    url: '/reportApply/saveApply',
    method: 'post',
    data: params
  })
}
export function checReporApply(params) {
  return axios({
    url: '/reportApply/checkApply',
    method: 'post',
    data: params
  })
}
export function getEthicsList() {
  return axios({
    url: '/ethics/getDataList',
    method: 'post',
  })
}

export function ethicsDownload(params) {
  return axios({
    url: '/ethics/download',
    method: 'post',
    data: params
  })
}