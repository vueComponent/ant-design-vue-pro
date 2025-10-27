/**
 * 全部提现记录
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/withdrawal/allRecord/page',

}
/**
 * 分页
 * @param {*} parameter
 * @returns
 */
export function Page(parameter) {
  return request({
    url: Api.page + '?' + qs.stringify(parameter),
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
