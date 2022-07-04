import api from './index'
import { axios } from '@/utils/request'

// 查询所有消息
export function getMessageList (params) {
  return axios({
    url: '/announcement/getDataList',
    method: 'get',
    data: params
  })
}
// 撤回消息
export function withdrawData (announcementId) {
  return axios({
    url: '/announcement/revocation/' + announcementId,
    method: 'post'
  })
}
// 发布消息
export function publishData (announcementId) {
  return axios({
    url: '/announcement/publish/' + announcementId,
    method: 'post'
  })
}
// 编辑或者新增消息
export function saveOrUpdateData (params) {
  return axios({
    url: '/announcement/saveOrUpdate',
    method: 'post',
    data: params
  })
}
// 删除通知
export function deleteData (id) {
  return axios({
    url: '/announcement/' + id + '/cancel',
    method: 'post'
  })
}
