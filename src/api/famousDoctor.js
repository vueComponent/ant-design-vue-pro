import {
  axios
} from '@/utils/request'

export function getFamousDoctorList(parameter) {
  return axios({
    url: '/famousDoctor/getDataList',
    method: 'post',
    params: parameter
  })
}

export function getDoctorDetail(parameter) {
  return axios({
    url: '/famousDoctor/getDoctorDetail',
    method: 'post',
    params: parameter
  })
}

export function saveDoctor(parameter) {
  return axios({
    url: '/famousDoctor/saveDoctorDetail',
    method: 'post',
    params: parameter
  })
}

export function getCenter(parameter) {
  return axios({
    url: '/famousDoctor/getCenter',
    method: 'post',
    params: parameter
  })
}