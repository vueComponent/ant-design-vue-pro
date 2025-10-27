/**
 * 仪表盘-工作台api接口
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 用户统计
  userStat: '/dashboard/workplace/userStat',
  // 总节点统计
  totalNodeStat: '/dashboard/workplace/totalNodeStat',
  // 在线节点统计
  onlineNodeStat: '/dashboard/workplace/onlineNodeStat',
  // 离线统计
  outlineNodeStat: '/dashboard/workplace/outlineNodeStat',
  // 结算金额统计
  settleAmountStat: '/dashboard/workplace/settleAmountStat',
  // 统计利润
  manageSettleAmountStat: '/dashboard/workplace/manageSettleAmountStat',
  // 余额统计
  moneyStat: '/dashboard/workplace/moneyStat',
  // 获取邀请码
  getInviteCode: '/dashboard/workplace/getInviteCode',
}

/**
 * 获取邀请码
 * @returns {*}
 */
export function GetInviteCode () {
  return request({
    url: Api.getInviteCode,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 统计利润
 * @returns {*}
 */
export function MoneyStat () {
  return request({
    url: Api.moneyStat,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 统计利润
 * @returns {*}
 */
export function ManageSettleAmountStat () {
  return request({
    url: Api.manageSettleAmountStat,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 结算金额统计
 * @returns {*}
 */
export function SettleAmountStat () {
  return request({
    url: Api.settleAmountStat,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 离线统计
 * @returns {*}
 */
export function OutlineNodeStat () {
  return request({
    url: Api.outlineNodeStat,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 在线节点统计
 * @returns {*}
 */
export function OnlineNodeStat () {
  return request({
    url: Api.onlineNodeStat,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 总节点统计
 * @returns {*}
 */
export function TotalNodeStat () {
  return request({
    url: Api.totalNodeStat,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 用户统计
 * @returns {*}
 */
 export function UserStat () {
  return request({
    url: Api.userStat,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
