/**
 * 线路
 */
import request from '@/utils/request'

const Api = {
  // 线路
  line: '/line',
  // 获取线路详情
  getLineDetails: '/line/details',
  // 调整线路
  modifyLine: '/line/modifyLine',
}
/**
 * 调整线路
 * @param {*} parameter 
 * @returns 
 */
export function ModifyLine(parameter) {
  return request({
    url: Api.modifyLine,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}

/**
 *  获取线路账户信息
 * @returns
 */
export function GetLineAccount(id) {
  return request({
    url: Api.line + '/' + id,
    method: 'get',
  })
}

/**
 *  获取线路汇聚信息
 * @returns
 */
export function GetLineDetails(id) {
  return request({
    url: Api.getLineDetails + '/' + id,
    method: 'get',
  })
}