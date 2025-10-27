/**
 * 财务-财务明细
 * @date 2021年10月20日 下午10:44:34
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/finance/detail/page'
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
