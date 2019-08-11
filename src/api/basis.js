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