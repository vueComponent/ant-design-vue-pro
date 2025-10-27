/**
 * 查询-查询配置
 * @date 2021年11月2日 上午9:50:33
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/device/index/page',
  // 拉取所有设备
  pullAllDevice: '/device/index/pullAllDevice',
  // 拨号配置
  dialConfig: '/device/index/dialConfig',
  // 获取拨号配置
  getDialConfig: '/device/index/getDialConfig',
}

/**
* 获取拨号配置
* @param {string} deviceId 设备id
* @returns
*/
export function GetDialConfig(deviceId) {
  return request({
    url: Api.getDialConfig + "/" + deviceId,
    method: 'get'
  })
}

/**
* 拨号配置
* @param {string} deviceId 设备id
* @param {} dialMode 拨号方式
* @param {} dialData 拨号信息集合
* @returns
*/
export function DialConfig(deviceId, dialMode, dialData) {
  return request({
    url: Api.dialConfig + "/" + deviceId + "/" + dialMode,
    method: 'post',
    data: dialData,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

/**
* 拉取所有设备
* @returns
*/
export function PullAllDevice() {
  return request({
    url: Api.pullAllDevice,
    method: 'get'
  })
}

/**
 * 分页
 * @param {*} parameter
 * @returns
 */
export function Page(parameter) {
  return request({
    url: Api.page + '?' + qs.stringify(parameter),
    method: 'get'
  })
}
