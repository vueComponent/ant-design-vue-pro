/**
 * 短信-短信验证码
 * @date 2021年10月21日 下午9:19:22
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/sms/receive/page',
  // 获取key
  getKey: '/sms/receive/config/getKey',
  // 保存key
  saveKey: '/sms/receive/config/saveKey'
}

/**
 * 保存key
 * @param {*} parameter
 * @returns
 */
 export function SaveKey (parameter) {
  return request({
    url: Api.saveKey,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取key
 * @param {*} parameter
 * @returns
 */
 export function GetKey () {
  return request({
    url: Api.getKey,
    method: 'get',
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
