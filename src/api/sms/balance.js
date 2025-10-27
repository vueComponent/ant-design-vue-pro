/**
 * 用户短信余额
 * @date 2021年10月21日 下午9:19:22
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/sms/balance/page',
  // 赠送短信条数
  giftSms: '/sms/balance/giftSms'
}

/**
 * 赠送短信条数
 */
export function GiftSms (parameter) {
  return request({
    url: Api.giftSms,
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
