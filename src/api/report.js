import { axios } from '@/utils/request'

const api = {
  reportCollectBase: '/reportCollectBase'
}

export default api


export function getReportList (parameter) {
  return axios({
    url: '/reportCollectBase/getDataList',
    method: 'post',
    params: parameter
  })
}
