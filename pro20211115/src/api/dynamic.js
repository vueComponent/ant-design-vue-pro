/**
* @Description: 动态管理接口
* 
* @Date: 2021/11/11
*/
import request from '@/utils/request'

const dynamicApi = {
  adminGetLostFoundList: '/lostfound/adminGetLostFoundList', // 管理员分页获取同德失物招领
  adminDeleteCensorTongde: '/lostfound/adminCensorTongde', // 管理员删除同德失物招领
  adminCheckTongde: '/entityChecked/adminCheckTongde', // 管理员审核同德动态

  adminGetTeamList: '/team/adminGetTeamList', // 管理员分页获取济人组队
  adminDeleteCensorJiren: '/team/adminCensorJiren', // 管理员删除济人动态
  adminCheckJiren: '/entityChecked/adminCheckJiren', // 管理员审核济人动态
  adminGetTeam: '/team/adminGetTeam', // 获取济人组队详情

  adminGetPostingList: '/posting/adminGetPostingList', // 管理员分页获取所有济事帖子
  adminCensorJishi: '/posting/adminCensorJishi', // 管理员删除济事动态
  adminCheckJishi: '/entityChecked/adminCheckJishi', // 管理员审核济事动态

  countCheckedByAdminWithPage: '/entityChecked/countCheckedByAdminWithPage', //分页 审核管理列表

  getAdminPostingWithPage: '/posting/getAdminPostingWithPage', //分页获取管理员的帖子
  adminLogicDeletePosting: '/posting/adminLogicDeletePosting', //软删除帖子或素材
}

export function countCheckedByAdminWithPage (parameter) {
  return request({
    url: dynamicApi.countCheckedByAdminWithPage,
    method: 'get',
    params: parameter
  })
}

export function adminGetPostingList (parameter) {
  return request({
    url: dynamicApi.adminGetPostingList,
    method: 'get',
    params: parameter
  })
}

export function adminCensorJishi (parameter) {
  return request({
    url: `${dynamicApi.adminCensorJishi}/${parameter}`,
    method: 'patch'
  })
}

export function adminCheckJishi (parameter) {
  return request({
    url: `${dynamicApi.adminCheckJishi}/${parameter}`,
    method: 'get'
  })
}

export function adminGetTeamList (parameter) {
  return request({
    url: dynamicApi.adminGetTeamList,
    method: 'get',
    params: parameter
  })
}

export function adminDeleteCensorJiren (parameter) {
  return request({
    url: `${dynamicApi.adminDeleteCensorJiren}/${parameter}`,
    method: 'get'
  })
}

export function adminCheckJiren (parameter) {
  return request({
    url: `${dynamicApi.adminCheckJiren}/${parameter}`,
    method: 'get'
  })
}

export function adminGetTeam (parameter) {
  return request({
    url: `${dynamicApi.adminGetTeam}/${parameter}`,
    method: 'get'
  })
}

export function adminGetLostFoundList (parameter) {
  return request({
    url: dynamicApi.adminGetLostFoundList,
    method: 'get',
    params: parameter
  })
}

export function adminDeleteCensorTongde (parameter) {
  return request({
    url: `${dynamicApi.adminDeleteCensorTongde}/${parameter}`,
    method: 'get'
  })
}

export function adminCheckTongde (parameter) {
  return request({
    url: `${dynamicApi.adminCheckTongde}/${parameter}`,
    method: 'get'
  })
}

export function getAdminPostingWithPage (parameter) {
  return request({
    url: dynamicApi.getAdminPostingWithPage,
    method: 'get',
    params: parameter
  })
}

export function adminLogicDeletePosting (parameter) {
  return request({
    url: `${dynamicApi.adminLogicDeletePosting}/${parameter}`,
    method: 'DELETE'
  })
}
