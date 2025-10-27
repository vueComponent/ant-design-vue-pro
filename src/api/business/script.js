/**
 * 业务分类
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/business/script/page',
  // 新增或修改
  save: '/business/script',
  // 删除
  removeById: '/business/script',
  // 列表
  list: '/business/script/list',
}

/**
 * 列表
 * @returns {*}
 */
export function List () {
  return request({
    url: Api.list,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 添加
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
/**
 * 删除
 * @p
 * @param parameter
 * @returns {*}
 */
export function Remove (id) {
  return request({
    url: Api.removeById +"/"+ id,
    method: 'delete',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
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