/**
 * 上游接口配置
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 分页
  page: '/upstream/apiConfig/page',
  /**
   * 添加或更新，传id更新
   */
  save: '/upstream/apiConfig/save',
  // 删除
  remove: '/upstream/apiConfig/remove',
  // 获取接口配置全部集合
  list: '/upstream/apiConfig/list',
  // 获取上游公司
  upstreamCompanyList: '/upstream/apiConfig/upstreamCompanyList',
  // 配置规则
  configRule: '/upstream/apiConfig/configRule',
  // 修改配置
  updateConfig: '/upstream/apiConfig/updateConfig',
}

/**
 * 修改配置
 */
export function UpdateConfig (parameter) {
  return request({
    url: Api.updateConfig,
    method: 'post',
    data: parameter,
    headers: {
      // json类型，utf-8编码
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 配置规则
 * @returns 
 */
export function ConfigRule () {
  return request({
    url: Api.configRule,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 获取上游公司
 * @returns 
 */
export function UpstreamCompanyList () {
  return request({
    url: Api.upstreamCompanyList,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
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