/**
 * 上游脚本配置
 */
import request from '@/utils/request'

const Api = {
  save: '/upstream/script',
  getById: '/upstream/script'
}

/**
 * 保存
 * @param {*} parameter 
 * @returns 
 */
export function Save(parameter) {
  return request({
    url: Api.save,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 根据上游id查询
 * @param id
 * @returns {*}
 */
export function GetByUpstreamId(id) {
  return request({
    url: Api.getById + '/' + id,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
