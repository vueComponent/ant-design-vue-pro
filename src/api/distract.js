import { axios } from '@/utils/request'

const api = {
    distract: '/distract'
}

export default api


export function getZyDataList (data) {
  return axios({
    url: '/distract/getZyDataList',
    method: 'post',
    data
  })
}

export function addDistract (data) {
  return axios({
    url: '/distract/addDistract',
    method: 'post',
    data
  })
}

export function getSqDataList (data) {
    return axios({
      url: '/distract/getSqDataList',
      method: 'post',
      data
    })
  }

export function verifyDistract (data) {
  return axios({
    url: '/distract/verifyDistract',
    method: 'post',
    data
  })
}

export function getWxBingDataList (data) {
  return axios({
    url: '/wxBusiness/getDataList',
    method: 'post',
    data
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

export function getWxQuestionList (data) {
  return axios({
    url: '/question/getWxQuestionList',
    method: 'post',
    data
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

