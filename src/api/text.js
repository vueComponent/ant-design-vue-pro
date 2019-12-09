import {
  axios
} from '@/utils/request'

export function getWXList(parameter) {
  return axios({
    url: '/text/getWXList',
    method: 'post',
    params: parameter
  })
}

export function getWebsiteList(parameter) {
    return axios({
      url: '/text/getWebsiteList',
      method: 'post',
      params: parameter
    })
  }

export function getArticleDetail(parameter) {
  return axios({
    url: '/text/viewAll',
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
