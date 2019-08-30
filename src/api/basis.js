import api from './index'
import { axios } from '@/utils/request'

export function submit(params) {
  return axios({
    url: '/basis/saveBasis',
    method: 'post',
    data: params
  })
}

export function getElementsAnswer(params) {
  return axios({
    url: '/basisMask/getElementsAnswer',
    method: 'post',
    data: params
  })
}
//获得省市
export function getProvinceAndCity() {
  return axios({
    url: '/dictionaryAttribute/getProvinceAndCity',
    method: 'post'
  })
}
//获得民族
export function getNation() {
  return axios({
    url: '/dictionaryAttribute/getNation',
    method: 'post'
  })
}
//根据字典ID获得内容
export function getDictionaryAttributeByDictionaryId(params) {
  return axios({
    url: '/dictionaryAttribute/getDictionaryAttributeByDictionaryId',
    method: 'post',
    data: params
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

export function getPatientBasis(params) {
  return axios({
    url: '/basis/getPatientBasis',
    method: 'post',
    data: params
  })
}

export function computeScore(params) {
  return axios({
    url: '/basis/computeScore',
    method: 'post',
    data: params
  })
}