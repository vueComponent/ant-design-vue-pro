import {
  axios
} from '@/utils/request'

export function getWxArticleList(parameter) {
  return axios({
    url: '/text/getDataList',
    method: 'get',
    params: parameter
  })
}

export function getWxArticleDetail(parameter) {
  return axios({
    url: `/text/${parameter}/view`,
    method: 'get',
  })
}

export function addOrEdit(parameter) {
  return axios({
    url: `/text/addOrEdit`,
    method: 'post',
    params: parameter
  })
}