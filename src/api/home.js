import api from './index'
import {
  axios
} from '@/utils/request'

export function getAllNumbers() {
  return axios({
    url: '/index/getAllNumbers',
    method: 'post'
  })
}
export function getMyWork() {
  return axios({
    url: '/index/getMyWork',
    method: 'post',
  })
}
export function getPatientsAndBasiss() {
  return axios({
    url: '/index/getPatientsAndBasiss',
    method: 'post',
  })
}
export function getProvinceCompare() {
  return axios({
    url: '/index/getProvinceCompare',
    method: 'post',
  })
}

export function manualList(params) {
  return axios({
    url: '/index/manual',
    method: 'post'
  })
}

export function uploadFlie(params) {
  return axios({
    url: '/ethics/save',
    method: 'post',
    data: params
  })
}

export function fileList() {
  return axios({
    url: '/ethics/getEthics',
    method: 'post'
  })
}