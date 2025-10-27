/**
 * 上游业务配置
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/upstream/business/page',
  /**
   * 添加或更新，传id更新
   */
  save: '/upstream/business/save',
  // 删除
  remove: '/upstream/business/remove',
  // 获取列表
  list: '/upstream/business/list',
  /**
   * 修改价格
   */
  modifyPrice: '/upstream/business/modifyPrice',
}

/**
 * 修改价格
 * @param {*} parameter 
 * @returns 
 */
export function ModifyPrice (parameter) {
  return request({
    url: Api.modifyPrice,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 获取列表
 * @returns {*}
 */
export function List () {
  return request({
    url: Api.list,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 删除
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