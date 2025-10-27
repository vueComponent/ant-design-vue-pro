/**
 * 查询-查询配置
 * @date 2021年11月2日 上午9:50:33
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  page: '/withdrawal/bankAccount/page',
  remove: '/withdrawal/bankAccount',
}

/**
*  删除提现账号
* @param {*} parameter
* @returns
*/
export function Remove (id) {
  return request({
    url: Api.remove + '/' + id,
    method: 'delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 分页
 * @param parameter
 * @returns {*}
 */
export function Page (parameter) {
  return request({
    url: Api.page + '?' + qs.stringify(parameter),
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
