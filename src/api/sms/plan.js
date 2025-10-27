/**
 * 短信套餐
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 获取全部短信套餐
  list: '/sms/plan/list',
  // 添加和编辑
  save: '/sms/plan/save',
  // 删除
  remove: '/sms/plan/remove',
}
/**
 * 按id删除
 * @param {*} parameter
 * @returns
 */
export function Remove (parameter) {
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
 * 添加和编辑
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
 * 获取全部短信套餐
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
