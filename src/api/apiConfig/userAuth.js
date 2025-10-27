/**
 * 实名认证
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  get: '/apiConfig/userAuth/get',
  save: '/apiConfig/userAuth/save',
}

/**
* 查询配置
* @returns
*/
export function GetUserAuth () {
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
export function SaveUserAuth (parameter) {
  return request({
    url: Api.save,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
