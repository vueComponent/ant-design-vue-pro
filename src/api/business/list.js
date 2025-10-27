/**
 * 上游接口配置
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/business/list/page',
  // 添加
  add: '/business/list/add',
  // 更新业务价格
  edit: '/business/list/edit',
  // 删除
  remove: '/business/list/remove',
  // 获取接口配置全部集合
  list: '/business/list/list',
  // 修改抽成
  modifyDeduct: '/business/list/modifyDeduct',
  // 全局价格列表
  globalPriceList: '/business/list/globalPrice/list',
  // 保存全局价格
  globalPriceSave: '/business/list/globalPrice/save',
  // 推荐人抽成保存
  referrerCutSave: '/business/list/referrerCut/save',
  // 获取推荐人抽成
  getReferrerCut: '/business/list/referrerCut/getByUserId',
  // 修改上游价格
  modifyUpstreamPrice: '/business/list/modifyUpstreamPrice',
  // 修改结算周期
  modifySettlementPeriod: '/business/list/modifySettlementPeriod',
  // 获取结算周期枚举列表
  settlementPeriodEnumList: '/business/list/settlementPeriodEnumList',
  // 排序修改
  updateSort: '/business/list/updateSort',
  // 修改启用
  updateEnabled: '/business/list/updateEnabled',
}

/**
 * 排序修改
 * @param {*} parameter 
 * @returns 
 */
export function UpdateSort (parameter) {
  return request({
    url: Api.updateSort,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 开关修改
 * @param {*} parameter 
 * @returns 
 */
export function UpdateEnabled (parameter) {
  return request({
    url: Api.updateEnabled,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取结算周期枚举列表
 */
export function SettlementPeriodEnumList () {
  return request({
    url: Api.settlementPeriodEnumList,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 修改结算周期
 * @param {*} parameter 
 * @returns 
 */
export function ModifySettlementPeriod (parameter) {
  return request({
    url: Api.modifySettlementPeriod,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 修改上游价格
 * @param {*} parameter 
 * @returns 
 */
export function ModifyUpstreamPrice (parameter) {
  return request({
    url: Api.modifyUpstreamPrice,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取推荐人抽成
 */
export function GetReferrerCut () {
  return request({
    url: Api.getReferrerCut,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 保存全局价格
 * @param {*} parameter 
 * @returns 
 */
export function ReferrerCutSave (parameter) {
  return request({
    url: Api.referrerCutSave,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 保存全局价格
 * @param {*} parameter 
 * @returns 
 */
export function GlobalPriceSave (parameter) {
  return request({
    url: Api.globalPriceSave,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取业务全局价格
 * @returns 
 */
export function GlobalPriceList () {
  return request({
    url: Api.globalPriceList,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 修改抽成
 * @param {*} parameter 
 * @returns 
 */
export function ModifyDeduct (parameter) {
  return request({
    url: Api.modifyDeduct,
    method: 'post',
    data: parameter,
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
    data: parameter,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 *  获取接口配置全部集合
 */
export function List () {
  return request({
    url: Api.list,
    method: 'get',
  })
}
/**
 * 添加
 * @param {*} parameter 
 * @returns 
 */
export function Add (parameter) {
  return request({
    url: Api.add,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
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
    url: Api.page + '?' + qs.stringify(parameter),
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 添加或更新，传id更新
 * @param {*} parameter
 * @returns
 */
export function Save (parameter) {
  return request({
    url: Api.save,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}