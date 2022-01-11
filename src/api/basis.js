import api from './index'
import { axios } from '@/utils/request'

export function saveBasis(params) {
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

export function getMedicineAllergyList(params) {
  return axios({
    url: '/basis/getMedicineAllergyList',
    method: 'post',
    data: params
  })
}

export function getAllQuestionList(params) {
  return axios({
    url: '/question/detail',
    method: 'post',
    data: params
  })
}

export function getTaskDetail(params) {
  return axios({
    url: '/visitTask/getVisitTaskDetail',
    method: 'post',
    data: params
  })
}

export function saveQuestion(params) {
  return axios({
    url: '/question/save',
    method: 'post',
    data: params
  })
}

export function getCollectDetail(params) {
  return axios({
    url: '/reportCollectBase/getByBasisElementId',
    method: 'post',
    data: params
  })
}

export function addVasit(params) {
  return axios({
    url: '/visitTask/addVasit',
    method: 'post',
    data: params
  })
}

export function getCollectElements(params) {
  return axios({
    url: '/reportCollectBase/getBasisElementById',
    method: 'post',
    data: params
  })
}

export function saveReport(params) {
  return axios({
    url: '/reportCollectBase/addOrEditReportResult',
    method: 'post',
    data: params
  })
}

export function getVtList(params) {
  return axios({
    url: '/visitTask/getVtList',
    method: 'post',
    data: params
  })
}

export function importVtData(params) {
  return axios({
    url: '/visitTask/importVtData',
    method: 'post',
    data: params
  })
}

export function saveVisitTask(params) {
  return axios({
    url: '/visitTask/save',
    method: 'post',
    data: params
  })
}

export function getBasisForm(params) {
  return axios({
    url: '/basis/getFormData',
    method: 'post',
    data: params
  })
}

export function getSFJxDataList(params) {
  return axios({
    url: '/basis/getSFJxDataList',
    method: 'post',
    params: params
  })
}

export function createSFJx(params) {
  return axios({
    url: '/basis/createSFJx',
    method: 'post',
    data: params
  })
}

export function getQuestionDetail(params) {
  return axios({
    url: '/question/detail',
    method: 'post',
    data: params
  })
}

export function validateCard(params) {
  return axios({
    url: '/patient/getPatientDetailByCard',
    method: 'post',
    data: params
  })
}

export function getFsImportDate(params) {
  return axios({
    url: '/basis/getFsImportDate',
    method: 'post',
    data: params
  })
}

export function getOcrResult(params) {
  return axios({
    url: '/reportCollectBase/ocrResult',
    method: 'post',
    data: params
  })
}

export function downLoadManual(id) {
  return axios({
    url: '/index/downLoad?id=' + id,
    method: 'get'
  })
}

export function recoverSubmit(params) {
  return axios({
    url: '/basis/recoverSubmit',
    method: 'post',
    data: params
  })
}

export function outGroup(params) {
  return axios({
    url: '/basis/outGroup',
    method: 'post',
    data: params
  })
}

export function getJxDataList(params) {
  return axios({
    url: '/basis/getJxDataList',
    method: 'post',
    data: params
  })
}

export function submitCheck(params) {
  return axios({
    url: '/basis/submitCheck',
    method: 'post',
    data: params
  })
}

export function getCenterNum(params) {
  return axios({
    url: '/basis/getCenterNum',
    method: 'post',
    params: params
  })
}

export function patientReport(params) {
  return axios({
    url: '/patientReport/getDataList',
    method: 'post',
    params: params
  })
}

export function exportFormData(params) {
  return axios({
    url: '/basis/exportFormData',
    method: 'post',
    data: params
  })
}