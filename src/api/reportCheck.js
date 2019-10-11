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

export function getReportInfo(parameter) {
  return axios({
    url: '/reportCheck/getReport',
    method: 'post',
    params: parameter
  })
}

export function updateReport(parameter) {
  return axios({
    url: '/reportCheck/updateReport',
    method: 'post',
    params: parameter
  })
}