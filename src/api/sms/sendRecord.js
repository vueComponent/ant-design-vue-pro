/**
 * 短信发送记录
 * @date 2021年10月21日 下午9:19:22
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/sms/sendRecord/page'
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
