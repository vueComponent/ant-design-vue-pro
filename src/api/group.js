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

export function getDatalList(parameter) {
  return axios({
    url: '/project/getDataList',
    method: 'post',
    params: parameter
  })
}
export function getPatientList(parameter) {
  return axios({
    url: '/project/getPatientList',
    method: 'post',
     params: parameter
  })
}
export function joinProject(parameter) {
  return axios({
    url: '/project/joinProject',
    method: 'post',
    params: parameter
  })
}
export function deleteCase(parameter) {
  return axios({
    url: '/project/deleteCase',
    method: 'post',
    params: parameter
  })
}

// export function getPatientList (parameter) {
//   return axios({
//     url: '/patient/getDataList',
//     method: 'post',
//     params: parameter
//   })
// }
// 
// 
// export function getPatientDetail (parameter) {
//   return axios({
//     url: '/patient/detail',
//     method: 'post',
//     params: parameter
//   })
// }
// 
