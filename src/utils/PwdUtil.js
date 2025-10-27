/**
 * 密码工具类
 * @date 2021年10月24日 上午9:49:55
 */
 import md5 from 'md5'
/**
 * 登录加密
 * @param {*} pwdStr 密码
 * @param {*} code 验证码
 * @returns md5值
 */
export function login (pwdStr, code) {
  return md5(md5(md5(pwdStr)) + code.toLowerCase())
}

/**
 * 请求后台密码加密
 * @param {*} pwdStr 密码
 * @returns md5值
 */
 export function pwd (pwdStr) {
  return md5(md5(pwdStr))
}
