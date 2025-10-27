/**
 * 短信-短信验证码
 * @date 2021年10月21日 下午9:19:22
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/sms/deposit/page',
  add: '/sms/deposit/add/add',
  remove: '/sms/deposit/remove/byId',
  edit: '/sms/deposit/edit/byId'
}
/**
 * 编辑
 * @param {*} parameter
 * @returns
 */
 export function edit (parameter) {
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
 * 删除
 * @param {*} parameter
 * @returns
 */
 export function remove (parameter) {
  return request({
    url: Api.remove,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 添加
 * @param {*} parameter
 * @returns
 */
 export function add (parameter) {
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
 * 分页
 * @param {*} parameter
 * @returns
 */
export function page (parameter) {
  return request({
    url: Api.page,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
