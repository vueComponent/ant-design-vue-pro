/**
 * 提现管理-基本配置
 * @date 2021年11月4日 下午12:41:51
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  get: '/withdrawal/config/get',
  save: '/withdrawal/config/save'
}

/**
* 保存配置
* @param {*} parameter
* @returns
*/
export function Save (parameter) {
  return request({
    url: Api.save,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
/**
 *  获取配置
 * @returns
 */
export function Get () {
  return request({
    url: Api.get,
    method: 'get',
  })
}
