// import api from './index'
import { axios } from '@/utils/request'

// 查询所有消息
export function getMessageList (parameter) {
  return axios({
    url: '/announcement/getDataList',
    method: 'get',
    params: parameter
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
// 详情
export function detailData (announcementId) {
  return axios({
    url: '/announcement/' + announcementId + '/view',
    method: 'get'
  })
}

// 阅读公告
export function isReadDetail (announcementId) {
  return axios({
    url: '/announcement/readAnnouncement/' + announcementId,
    method: 'post'
  })
}
