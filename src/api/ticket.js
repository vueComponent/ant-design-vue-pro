import {
  axios
} from '@/utils/request'

export function getTicketDataList(data) {
  return axios({
    url: '/ticket/getDataList',
    method: 'post',
    data
  })
}

export function logoutTicket(data) {
  return axios({
    url: '/ticket/logoutTicket',
    method: 'post',
    data
  })
}