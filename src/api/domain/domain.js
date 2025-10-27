/**
 * 域名管理
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/domain/manage/page',
  // 域名保存
  save: '/domain/manage/save',
  // 获取集合
  list: '/domain/manage/list',
  // 修改状态
  modifyStatus: '/domain/manage/modifyStatus',
}
/**
 * 修改状态
 * @param {*} parameter 
 * @returns 
 */
export function ModifyStatus (parameter) {
  return request({
    url: Api.modifyStatus,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取集合
 * @returns 
 */
export function List () {
  return request({
    url: Api.list,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 域名保存
 * @param {*} parameter 
 * @returns 
 */
export function Save (parameter) {
  return request({
    url: Api.save,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 分页
 * @param {*} parameter
 * @returns
 */
export function Page (parameter) {
  return request({
    url: Api.page,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
