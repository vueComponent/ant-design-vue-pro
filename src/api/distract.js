import { axios } from '@/utils/request'

const api = {
  distract: '/distract'
}

export default api

// 获取患者注册信息
export function getZKDataList (parameter) {
  return axios({
    url: '/patientPending/getDataList',
    method: 'get',
    params: parameter
  })
}

export function getZyDataList (parameter) {
  return axios({
    url: '/distract/getZyDataList',
    method: 'post',
    params: parameter
  })
}

export function addDistract (data) {
  return axios({
    url: '/distract/addDistract',
    method: 'post',
    data
  })
}

export function getSqDataList (parameter) {
  return axios({
    url: '/distract/getSqDataList',
    method: 'post',
    params: parameter
  })
}

export function verifyDistract (data) {
  return axios({
    url: '/distract/verifyDistract',
    method: 'post',
    data
  })
}

export function getWxBingDataList (parameter) {
  return axios({
    url: '/wxBusiness/getDataList',
    method: 'post',
    params: parameter
  })
}

export function wxPatientReview (data) {
  return axios({
    url: '/wxBusiness/wxPatientReview',
    method: 'post',
    data
  })
}

export function wxBind (data) {
  return axios({
    url: '/wxBusiness/bind',
    method: 'post',
    data
  })
}

export function getWxQuestionList (parameter) {
  return axios({
    url: '/question/getWxQuestionList',
    method: 'post',
    params: parameter
  })
}

export function getWxQuestionDetail (data) {
  return axios({
    url: '/question/detail',
    method: 'post',
    data
  })
}

export function questionReview (data) {
  return axios({
    url: '/question/questionReview',
    method: 'post',
    data
  })
}
