import api from './index'
import {
  axios
} from '@/utils/request'

export function getCenterDataList(parameter) {
  return axios({
    url: '/authority/getCenterDataList',
    method: 'post',
    params: parameter
  })
}

export function saveCenter(parameter) {
  return axios({
    url: '/authority/saveCenter',
    method: 'post',
    params: parameter
  })
}

export function getRoleDataList(parameter) {
  return axios({
    url: '/authority/getRoleDataList',
    method: 'post',
    params: parameter
  })
}

export function saveRole(parameter) {
  return axios({
    url: '/authority/saveRole',
    method: 'post',
    params: parameter
  })
}

export function getDoctorDataList(parameter) {
  return axios({
    url: '/authority/getDoctorDataList',
    method: 'post',
    params: parameter
  })
}

export function saveDoctor(parameter) {
  return axios({
    url: '/authority/saveDoctor',
    method: 'post',
    params: parameter
  })
}

export function getDoctorDetail(parameter) {
    return axios({
      url: '/authority/getDoctorDetail',
      method: 'post',
      params: parameter
    })
  }