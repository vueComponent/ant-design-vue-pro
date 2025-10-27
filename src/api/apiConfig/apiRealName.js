/**
 * 银行卡四要素接口
 */
import request from '@/utils/request'

const Api = {
  get: '/apiRealName/detail',
  saveOrUpdate: '/apiRealName/saveOrUpdate',
}

/**
* 查询实名认证配置
* @returns
*/
export function Detail () {
  return request({
    url: Api.get,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 保存或更新配置
 * @param {*} parameter
 * @returns
 */
export function SaveOrUpdate (parameter) {
  return request({
    url: Api.saveOrUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
