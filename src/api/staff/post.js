/**
 * 员工-员工管理
 * @date 2021年10月9日 下午5:34:12
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  init: '/staff/post/init',
  // 按菜单id获取操作权限
  listOperationByMenuId: '/staff/post/listOperationByMenuId',
  add: '/staff/post/add',
  page: '/staff/post/page',
  listByRoleId: '/staff/post/listByRoleId',
  editById: '/staff/post/editById',
  removeById: '/staff/post/removeById'
}
/**
 * 按id删除角色
 * @param {*} parameter
 * @returns
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
 * 岗位编辑
 * @param {*} parameter
 * @returns
 */
 export function EditById (parameter) {
  return request({
    url: Api.editById,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 按角色id获取菜单数据
 * @param {*} parameter
 * @returns
 */
export function ListByRoleId (parameter) {
  return request({
    url: Api.listByRoleId,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 岗位分页
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
/**
 * 岗位添加
 * @param {*} parameter
 * @returns
 */
export function Add (parameter) {
  return request({
    url: Api.add,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 按菜单id获取操作权限
 * @param parameter
 * @returns {*}
 */
export function ListOperationByMenuId (parameter) {
  return request({
    url: Api.listOperationByMenuId,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 添加岗位初始化菜单
 * @param parameter
 * @returns {*}
 */
 export function Init () {
  return request({
    url: Api.init,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
