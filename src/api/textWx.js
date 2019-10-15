import {
  axios
} from '@/utils/request'

export function getWxArticleList(parameter) {
  return axios({
    url: '/textWx/getDataList',
    method: 'get',
    params: parameter
  })
}

export function getWxArticleDetail(parameter) {
  return axios({
    url: `/textWx/${parameter}/view`,
    method: 'get',
  })
}

export function addOrEdit(parameter) {
  return axios({
    url: `/textWx/addOrEdit`,
    method: 'post',
    params: parameter
  })
}