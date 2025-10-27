/**
 * 上游接口配置
 */
import request from '@/utils/request'

const Api = {

  /**
   * 添加或更新，传id更新
   */
  saveOrUpdateBatch: '/biz/SettlePeriod/saveOrUpdateBatch',
}

/**
 * 保存或更新批量
 * @param {*} parameter
 * @returns
 */
export function SaveOrUpdateBatch (parameter) {
  return request({
    url: Api.saveOrUpdateBatch,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}