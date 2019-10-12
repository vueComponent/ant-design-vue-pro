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

export function getSqDataList (parameter) {
    return axios({
      url: '/distract/getSqDataList',
      method: 'post',
      params: parameter
    })
  }

export function verifyDistract (parameter) {
  return axios({
    url: '/distract/verifyDistract',
    method: 'post',
    params: parameter
  })
}

export function getWxAuditDataList (parameter) {
  return axios({
    url: '/wxBusiness/getDataList',
    method: 'post',
    params: parameter
  })
}

export function wxPatientReview (parameter) {
  return axios({
    url: '/wxBusiness/wxPatientReview',
    method: 'post',
    params: parameter
  })
}

export function wxBind (parameter) {
  return axios({
    url: '/wxBusiness/bind',
    method: 'post',
    params: parameter
  })
}

export function getWxQuestionList (parameter) {
  return axios({
    url: '/question/getWxQuestionList',
    method: 'post',
    params: parameter
  })
}

export function getWxQuestionDetail (parameter) {
  return axios({
    url: '/question/detail',
    method: 'post',
    params: parameter
  })
}

export function questionReview (parameter) {
  return axios({
    url: '/question/questionReview',
    method: 'post',
    params: parameter
  })
}

