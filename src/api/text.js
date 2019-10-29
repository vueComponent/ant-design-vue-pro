import {
  axios
} from '@/utils/request'

export function getWxArticleList(parameter) {
  return axios({
    url: '/text/getForm',
    method: 'get',
    params: parameter
  })
}

export function getWxArticleDetail(parameter) {
  return axios({
    url: `/text/viewAll`,
    method: 'get',
    params: parameter
  })
}

export function addOrEdit(data) {
  return axios({
    url: `/text/addOrEdit`,
    method: 'post',
    data
  })
}
