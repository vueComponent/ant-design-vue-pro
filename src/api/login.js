import request from '@/utils/request'

const userApi = {
  LoginOrg: '/organization/login',
  LoginAdmin: '/admin/login',
  Logout: '/organization/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  UserMenu: '/user/nav',
  Forget: '/organization/organizationResetPassword'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function loginOrg (parameter) {
  return request({
    url: userApi.LoginOrg,
    method: 'post',
    data: parameter
  })
}

export function loginAdmin (parameter) {
  return request({
    url: userApi.LoginAdmin,
    method: 'post',
    data: parameter
  })
}

export function forgetOrg (parameter) {
  return request({
    url: userApi.Forget,
    method: 'get',
    params: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  console.log('GETINFO')
  return request({
    url: userApi.UserInfo,
    method: 'get'
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  localStorage.clear()
  sessionStorage.clear()
  return request({
    url: userApi.Logout,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
