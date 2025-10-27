/**
 * 员工-员工管理
 * @date 2021年10月9日 下午5:34:12
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/staff/manage/page',
  // 添加用户级别
  add: '/staff/manage/add',
  // 删除级别
  removeById: '/staff/manage/removeById',
  // 编辑
  edit: '/staff/manage/edit',
  listRole: '/staff/manage/listRole',
  modifyStateById: '/staff/manage/modifyStateById'
}

/**
 * 修改状态
 * @param {*} parameter
 * @returns
 */
 export function ModifyStateById (parameter) {
  return request({
    url: Api.modifyStateById,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取角色信息
 * @param {*} parameter
 * @returns
 */
 export function ListRole () {
  return request({
    url: Api.listRole,
    method: 'get',
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
/**
 * 添加用户级别
 * @p
 * @param parameter
 * @returns {*}
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
 * 删除用户
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
 * 编辑用户信息
 * @param parameter
 * @returns {*}
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
