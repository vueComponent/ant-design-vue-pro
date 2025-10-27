/**
 * 上游接口配置
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/user/userAuth/page',
  /**
   * 添加或更新，传id更新
   */
  save: '/user/userAuth/save',
  // 删除
  removeByIds: '/user/userAuth/removeByIds',
  // 批量审核
  batchReview: '/user/userAuth/batchReview',
}
/**
 * 批量审核
 * @param {*} parameter
 * @returns
 */
export function BatchReview (parameter) {
  return request({
    url: Api.batchReview,
    method: 'put',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 批量删除实名
 * @param {*} parameter 
 * @returns 
 */
export function BatchRemove (parameter) {
  return request({
    url: Api.removeByIds,
    method: 'delete',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
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
      'Content-Type': 'application/x-www-form-urlencoded'
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