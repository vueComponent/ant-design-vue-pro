import { axios } from '@/utils/request'

const api = {
  user: '/user',
  role: '/role',
  patient: '/patient',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api


export function getPatientList (parameter) {
  return axios({
    url: '/patient/getDataList',
    method: 'post',
    params: parameter
  })
}


export function getPatientDetail (parameter) {
  return axios({
    url: '/patient/detail',
    method: 'post',
    params: parameter
  })
}

//根据身份证号获取患者详情
export function getPatientDetailByCard (parameter) {
  return axios({
    url: '/patient/getPatientDetailByCard',
    method: 'post',
    data: parameter
  })
}
