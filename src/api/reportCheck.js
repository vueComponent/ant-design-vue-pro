import {
  axios
} from '@/utils/request'

export function getReportDataList(parameter) {
  return axios({
    url: '/reportCheck/getDataList',
    method: 'post',
    params: parameter
  })
}

export function getReportInfo(data) {
  return axios({
    url: '/reportCheck/getReport',
    method: 'post',
    data
  })
}

export function updateReport(data) {
  return axios({
    url: '/reportCheck/updateReport',
    method: 'post',
    data
  })
}