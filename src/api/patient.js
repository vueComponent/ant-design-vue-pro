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
