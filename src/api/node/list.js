/**
 * 节点列表
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/node/list/page',
  // 批量删除
  remove: '/node/list/remove',
  // 获取节点详情
  details: '/node/list/details',
  // 添加节点
  add: '/node/list/add',
  // 节点编辑
  edit: '/node/list/edit',
  // 节点转移
  nodeTransfer: '/node/list/nodeTransfer',
  // 手动拉取上游结算数据
  manualSettle: '/node/list/manualSettle',
  // 按节点id手动拉取上游结算数据
  manualSettleByIds: '/node/list/manualSettleByIds',
  // 节点清退
  repel: '/node/list/repel',
  // 获取资源监控
  getMonitorLogs: '/node/list/getMonitorLogs',
  // 节点调度修改
  modifySchedule: '/node/list/modifySchedule',
  // 获取节点详情
  getNodeDetails: '/node/list/getNodeDetails',
  // 获取网络压测信息
  getNetworkPressure: '/node/list/getNetworkPressure',
  // 发起网络压测,上机后使用
  sendNetworkPressure: '/node/list/sendNetworkPressure',
  // 获取线路汇聚信息
  getLinesConverge: '/node/list/getLinesConverge',
  // 获取运营商
  getIsp: '/node/list/getIsp',
  // 获取网络类型
  getNatType: '/node/list/getNatType',
  // 获取拨号方式
  getDialMode: '/node/list/getDialMode',
  // 测试连接
  detectConnectivity: '/node/list/detectConnectivity',
  // 提交拨号信息
  dialSubmit: '/node/list/dialSubmit',
  // 按节点id查询是否支持上机前拨号测试和网络压测
  supportPreDialTset: '/node/list/supportPreDialTset',
  // 拨号测试
  dialTest: '/node/list/dialTest',
  // 发起网络压测,上机前使用
  sendBeforeBindNetworkPressure: '/node/list/sendBeforeBindNetworkPressure',
  // 按节点id查询是否需要配置dhcp
  isDhcpNeedConfig: '/node/list/isDhcpNeedConfig',
  // 获取节点详情
  getNetCard: '/node/list/getNetCard',
}

/**
 * 获取节点网卡信息
 * @param {*} id 
 * @returns 
 */
export function GetNetCard (id) {
  return request({
    url: Api.getNetCard + '/' + id,
    method: 'get'
  })
}

/**
 * 按节点id查询是否需要配置dhcp
 * @returns 
 */
export function IsDhcpNeedConfig (id) {
  return request({
    url: Api.isDhcpNeedConfig + "/" + id,
    method: 'get'
  })
}

/**
 * 拨号测试
 * @returns 
 */
export function SendBeforeBindNetworkPressure (id) {
  return request({
    url: Api.sendBeforeBindNetworkPressure + "/" + id,
    method: 'get'
  })
}

/**
 * 拨号测试
 * @returns 
 */
export function DialTest (id) {
  return request({
    url: Api.dialTest + "/" + id,
    method: 'get'
  })
}

/**
 * 按节点id查询是否支持上机前拨号测试和网络压测
 * @returns 
 */
export function SupportPreDialTset (id) {
  return request({
    url: Api.supportPreDialTset + "/" + id,
    method: 'get'
  })
}

/**
 * 提交拨号信息
 * @returns 
 */
export function DialSubmit (id) {
  return request({
    url: Api.dialSubmit + "/" + id,
    method: 'get'
  })
}

/**
 * 测试连接
 * @returns 
 */
export function DetectConnectivity (id) {
  return request({
    url: Api.detectConnectivity + "/" + id,
    method: 'get'
  })
}
/**
 * 获取拨号方式
 * @returns 
 */
export function GetDialMode () {
  return request({
    url: Api.getDialMode,
    method: 'get'
  })
}

/**
 * 获取运营商
 * @returns 
 */
export function GetNatType () {
  return request({
    url: Api.getNatType,
    method: 'get'
  })
}

/**
 * 获取运营商
 * @returns 
 */
export function GetIsp () {
  return request({
    url: Api.getIsp,
    method: 'get'
  })
}
/**
 * 添加节点使用post
 */
export function Add (parameter) {
  return request({
    url: Api.add,
    method: 'post',
    data: parameter,
    headers: {
       // json类型
      'Content-Type': 'application/json'
    }
  })
}

/**
 * 获取线路汇聚信息
 * @param {*} id 
 * @returns 
 */
export function GetLinesConverge (id) {
  return request({
    url: Api.getLinesConverge + '/' + id,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 发起网络压测,上机后使用
 * @param {*} id 
 * @returns 
 */
export function SendNetworkPressure (id) {
  return request({
    url: Api.sendNetworkPressure + '/' + id,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 获取网络压测信息
 * @param {*} id 
 * @returns 
 */
export function GetNetworkPressure (id) {
  return request({
    url: Api.getNetworkPressure + '/' + id,
    method: 'get'
  })
}

/**
 * 获取节点详情
 * @param {*} id 
 * @returns 
 */
export function GetNodeDetails (id) {
  return request({
    url: Api.getNodeDetails + '/' + id,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 节点调度修改
 * @param parameter 请求参数
 * @returns 
 */
export const ModifySchedule = (parameter) => {
  return request({
    url: Api.modifySchedule,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取资源监控数据
 * @param {*} parameter 
 * @returns 
 */
export function GetMonitorLogs (parameter) {
  return request({
    url: Api.getMonitorLogs + '?' + qs.stringify(parameter),
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 节点清退
 * @param parameter
 * @returns {*}
 */
export function Repel (parameter) {
  return request({
    url: Api.repel,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 手动拉取上游结算数据
 * @param parameter
 * @returns {*}
 */
export function ManualSettle (parameter) {
  return request({
    url: Api.manualSettle,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 按节点id手动拉取上游结算数据
 * @param parameter
 * @returns {*}
 */
export function ManualSettleByIds (parameter) {
  return request({
    url: Api.manualSettleByIds,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 节点编辑
 * @param parameter
 * @returns {*}
 */
export function Edit (parameter) {
  return request({
    url: Api.edit,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
  *  获取节点详情
  * @param {*} nodeId 节点id
  * @returns
  */
export function Details (nodeId) {
  return request({
    url: Api.details + '/' + nodeId,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
  *  批量删除
  * @param {*} parameter
  * @returns
  */
export function Remove (parameter) {
  return request({
    url: Api.remove,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 分页
 * @param parameter
 * @returns {*}
 */
export function Page (parameter) {
  return request({
    url: Api.page + '?' + qs.stringify(parameter),
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
