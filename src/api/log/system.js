/**
 *  日志-系统日志
 * @date 2021年12月5日 下午3:21:30
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  page: '/log/system/page',
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
