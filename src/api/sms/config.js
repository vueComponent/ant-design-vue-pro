/**
 * 短信配置
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 添加和编辑
  save: '/sms/config/save',
  // 获取配置
  getConfig: '/sms/config/getConfig',
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
 * 添加和编辑
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