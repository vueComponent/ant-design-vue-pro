/**
 * 域名基本配置
 * @date 2021年10月20日 下午10:44:34
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 基本配置保存
  save: '/domain/basic/save',
  // 查询基本配置
  get: '/domain/basic/get'
}
/**
 * 查询基本配置
 * @returns 
 */
export function Get () {
  return request({
    url: Api.get,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 基本配置保存
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
