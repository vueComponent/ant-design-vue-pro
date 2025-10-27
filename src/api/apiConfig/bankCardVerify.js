/**
 * 银行卡四要素接口
 */
import request from '@/utils/request'

const Api = {
  get: '/apiConfig/bankCardVerify/get',
  save: '/apiConfig/bankCardVerify/save',
}

/**
* 查询配置
* @returns
*/
export function GetBankCardVerify () {
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
export function SaveBankCardVerify (parameter) {
  return request({
    url: Api.save,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
