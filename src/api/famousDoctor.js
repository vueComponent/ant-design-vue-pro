import {
  axios
} from '@/utils/request'

export function getFamousDoctorList(data) {
  return axios({
    url: '/famousDoctor/getDataList',
    method: 'post',
    data
  })
}

export function getDoctorDetail(data) {
  return axios({
    url: '/famousDoctor/getDoctorDetail',
    method: 'post',
    data
  })
}

export function saveDoctor(data) {
  return axios({
    url: '/famousDoctor/saveDoctorDetail',
    method: 'post',
    data
  })
}

export function getCenter(data) {
  return axios({
    url: '/famousDoctor/getCenter',
    method: 'post',
    data
  })
}