import {
  axios
} from '@/utils/request'

export function getTicketDataList(parameter) {
  return axios({
    url: '/ticket/getDataList',
    method: 'post',
    params: parameter
  })
}

export function logoutTicket(parameter) {
  return axios({
    url: '/ticket/logoutTicket',
    method: 'post',
    params: parameter
  })
}