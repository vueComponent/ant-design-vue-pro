/**
 *  网站配置-基本配置
 * @date 2021年11月17日 上午9:47:10
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  get: '/web/basic/get',
  save: '/web/basic/save',
  // 删除logo
  removeLogo: '/web/basic/removeLogo',
  // 删除背景图片
  removeBackgroundImg: '/web/basic/removeBackgroundImg',
  // 获取用户协议
  getUserAgreements: '/userAgreements/get',
  // 获取隐私政策
  getUserPrivacyPolicies: '/userPrivacyPolicies/get',
}

/**
* 获取用户协议
* @returns
*/
export function GetUserPrivacyPolicies () {
  return request({
    url: Api.getUserPrivacyPolicies,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
* 获取用户协议
* @returns
*/
export function GetUserAgreements () {
  return request({
    url: Api.getUserAgreements,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
*  删除背景图片
* @returns
*/
export function RemoveBackgroundImg () {
  return request({
    url: Api.removeBackgroundImg,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
*  删除logo
* @returns
*/
export function RemoveLogo () {
  return request({
    url: Api.removeLogo,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
* 查询
* @returns
*/
export function Get () {
  return request({
    url: Api.get,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 保存配置
 * @param {*} parameter
 * @returns
 */
export function Save (parameter) {
  return request({
    url: Api.save,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
