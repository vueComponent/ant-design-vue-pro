/**
 *  系统-登录密码修改
 * @date 2021年11月21日 下午9:59:19
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  modifyPwd: '/system/security/modifyPwd',
  modifySuperPwd: '/system/security/modifySuperPwd',
  get: '/system/security/get',
  getSmsCode: '/system/security/getSmsCode',
  bindPhoneNumber: '/system/security/bindPhoneNumber',
  modifySecurity: '/system/security/modifySecurity'
}
/**
 *  开启短信验证码，如果开启状态，请求后将关闭，反则开启
 * @param {*} parameter
 * @returns
 */
 export function modifySecurity (parameter) {
  return request({
    url: Api.modifySecurity,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 绑定手机号
 * @param {*} parameter
 * @returns
 */
 export function bindPhoneNumber (parameter) {
  return request({
    url: Api.bindPhoneNumber,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取验证码
 * @param {*} parameter
 * @returns
 */
export function getSmsCode (parameter) {
  return request({
    url: Api.getSmsCode,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取安全配置信息
 * @returns
 */
export function get () {
  return request({
    url: Api.get,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改超级密码
 * @param {*} parameter
 * @returns
 */
export function modifySuperPwd (parameter) {
  return request({
    url: Api.modifySuperPwd,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改登录密码
 * @param {*} parameter
 * @returns
 */
export function modifyPwd (parameter) {
  return request({
    url: Api.modifyPwd,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
