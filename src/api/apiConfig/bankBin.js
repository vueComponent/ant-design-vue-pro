/**
 * 银行卡bin接口配置
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  get: '/apiConfig/bankBin/get',
  save: '/apiConfig/bankBin/save',
}

/**
* 查询配置
* @returns
*/
export function GetBankBin () {
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
export function SaveBankBin (parameter) {
  return request({
    url: Api.save,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
