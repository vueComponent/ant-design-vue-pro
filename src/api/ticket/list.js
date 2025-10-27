/**
 * 会员管理-会员列表
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 会员分页
  page: '/ticket/list/page',
  /**
   * 工单处理
   */
  edit: '/ticket/list/edit',
  // 删除工单
  remove: '/ticket/list/remove',
  // 添加工单类型
  addTicketType: '/ticket/list/addTicketType',
  // 修改工单类型名称
  modifyTicketTypeName: '/ticket/list/modifyTicketTypeName',
  // 删除工单类型
  removeTicketType: '/ticket/list/removeTicketType',
  // 修改工单类型状态
  ticketTypeList: '/ticket/list/ticketTypeList',
}

/**
 * 删除用户
 * @p
 * @param parameter
 * @returns {*}
 */
export function Remove (parameter) {
  return request({
    url: Api.remove,
    method: 'post',
    data: qs.stringify(parameter),
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
    url: Api.page,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 编辑
 * @param {*} parameter
 * @returns
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

// 添加工单类型
export function AddTicketType (parameter) {
  return request({
    url: Api.addTicketType,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 修改工单类型名称
 * @param {*} parameter 
 * @returns 
 */
export function ModifyTicketTypeName (parameter) {
  return request({
    url: Api.modifyTicketTypeName,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 删除工单类型
 * @param {*} parameter 
 * @returns 
 */
export function RemoveTicketType (parameter) {
  return request({
    url: Api.removeTicketType,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 工单类型列表
 * @returns 工单类型列表
 */
export function TicketTypeList () {
  return request({
    url: Api.ticketTypeList,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
