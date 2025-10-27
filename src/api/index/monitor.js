/**
 * 仪表盘-监控api接口
 * @data 2021-10-8 16:35
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 获取配置
  getConfig: '/dashboard/monitor/getConfig',
  saveConfig: '/dashboard/monitor/saveConfig',
  // 修改总开关
  modifyMasterSwitch: '/dashboard/monitor/modifyMasterSwitch',
  // 修改直充开关
  modifyOrderChargingSwitch: '/dashboard/monitor/modifyOrderZhichongSwitch',
  // 修改可疑订单开关
  modifyOrderKeyiSwitch: '/dashboard/monitor/modifyOrderKeyiSwitch',
  // 修改会员审核提醒开关
  modifyUserSwitch: '/dashboard/monitor/modifyUserSwitch',
  // 修改充值模板提醒开
  modifyChangetplSwitch: '/dashboard/monitor/modifyChangetplSwitch',
  // 修改查询模板提醒开关
  modifyQuerytplSwitch: '/dashboard/monitor/modifyQuerytplSwitch',
  modifyAgentWithdrawaSwitch: '/dashboard/monitor/modifyAgentWithdrawaSwitch',
  modifyGongzhongWithdrawaSwitch: '/dashboard/monitor/modifyGongzhongWithdrawaSwitch',
  modifyCardOrderSwitch: '/dashboard/monitor/modifyCardOrderSwitch',
  modifyCardSwitch: '/dashboard/monitor/modifyCardSwitch',
  // 修改配置,刷新时间和超时时间
  modifyConfig: '/dashboard/monitor/modifyConfig'
}
/**
 * 保存配置
 * @returns
 */
 export function saveConfig (parameter) {
  return request({
    url: Api.saveConfig,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 充值卡异常提醒开关
 * @returns
 */
 export function modifyCardSwitch (parameter) {
  return request({
    url: Api.modifyCardSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 充值卡订单导入可疑开关
 * @returns
 */
 export function modifyCardOrderSwitch (parameter) {
  return request({
    url: Api.modifyCardOrderSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 公众号提醒开关
 * @returns
 */
 export function modifyGongzhongWithdrawaSwitch (parameter) {
  return request({
    url: Api.modifyGongzhongWithdrawaSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 代理商提现提醒开关
 * @returns
 */
 export function modifyAgentWithdrawaSwitch (parameter) {
  return request({
    url: Api.modifyAgentWithdrawaSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取配置
 * @returns
 */
 export function GetConfig () {
  return request({
    url: Api.getConfig,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改总开关
 * @returns
 */
 export function ModifyMasterSwitch (parameter) {
  return request({
    url: Api.modifyMasterSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改直充订单开关
 * @returns
 */
 export function ModifyOrderChargingSwitch (parameter) {
  return request({
    url: Api.modifyOrderChargingSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改可疑订单开关
 * @returns
 */
 export function ModifyOrderKeyiSwitch (parameter) {
  return request({
    url: Api.modifyOrderKeyiSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改充值模板提醒开
 * @returns
 */
 export function ModifyUserSwitch (parameter) {
  return request({
    url: Api.modifyUserSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改充值模板提醒开
 * @returns
 */
export function ModifyChangetplSwitch (parameter) {
  return request({
    url: Api.modifyChangetplSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 修改查询模板提醒开关
 * @param parameter
 * @returns {*}
 */
 export function ModifyQuerytplSwitch (parameter) {
  return request({
    url: Api.modifyQuerytplSwitch,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/*
 * 修改配置,刷新时间和超时时间
 * parameter: {
 *     id: 0
 * }
*/
export function ModifyConfig (parameter) {
  return request({
    url: Api.modifyConfig,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
