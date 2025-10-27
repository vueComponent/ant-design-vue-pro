/**
 * 上游接口配置
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/business/priceGroup/page',
  /**
   * 添加或更新，传id更新
   */
  save: '/business/priceGroup/save',
  // 删除
  remove: '/business/priceGroup/remove',
  // 获取全部集合
  list: '/business/priceGroup/list',
}
/**
 *  获取全部集合
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
    method: 'get',
    data: qs.stringify(parameter),
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
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}