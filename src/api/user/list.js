/**
 * 会员管理-会员列表
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 会员分页
  page: '/user/list/page',
  // 添加用户
  add: '/user/list/add',
  // 编辑
  edit: '/user/list/edit',
  // 修改用户状态
  modifyState: '/user/list/modifyState',
  // 删除用户
  removeById: '/user/list/removeById',
  // 修改价格分组
  modifyPriceGroup: '/user/list/modifyPriceGroup',
  // 更改用户类型
  modifyUserType: '/user/list/modifyUserType',
  // 修改boss到期时间
  modifyBossDueTime: '/user/list/modifyBossDueTime',
}
/**
 * 修改boss到期时间
 * @param parameter
 * @returns {*}
 */
export function ModifyBossDueTime (parameter) {
  return request({
    url: Api.modifyBossDueTime,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 更改用户类型
 * @param parameter
 * @returns {*}
 */
export function ModifyUserType (parameter) {
  return request({
    url: Api.modifyUserType,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改价格分组
 * @param {*} parameter 请求对象
 * @returns 
 */
export function ModifyPriceGroup (parameter) {
  return request({
    url: Api.modifyPriceGroup,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 删除用户
 * @p
 * @param parameter
 * @returns {*}
 */
export function RemoveById (parameter) {
  return request({
    url: Api.removeById,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 分页
 * @param {*} parameter 请求对象
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
/**
 * 添加用户
 * @param {*} parameter
 * @returns
 */
export function Add (parameter) {
  return request({
    url: Api.add,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 编辑
 * @param {*} parameter
 * @returns
 */
export function Edit (parameter) {
  return request({
    url: Api.edit,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改用户状态
 * @param {*} parameter
 * @returns
 */
export function ModifyState (parameter) {
  return request({
    url: Api.modifyState,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

