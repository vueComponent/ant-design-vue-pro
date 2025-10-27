/**
 * 业务需求配置
 */
import request from '@/utils/request'

const Api = {
  // 添加
  save: '/business/ext',
  // 根据ID查询
  getById: '/business/ext/'
}

/**
 * 添加
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

/**
 * 获取全部
 * @returns 
 */
export function GetById (id) {
  return request({
    url: Api.getById + id,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}