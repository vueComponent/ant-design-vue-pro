/**
 * 节点价格
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  // 批量更新节点价格
  batchUpdatePrice: '/node/price/batchUpdatePrice',
  // 更新成本价
  updateCostPrice: '/node/price/updateCostPrice',
}

/**
 * 更新成本价
 */
export function UpdateCostPrice (parameter) {
  return request({
    url: Api.updateCostPrice,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 批量更新节点价格
 */
export function BatchUpdatePrice (parameter) {
  return request({
    url: Api.batchUpdatePrice,
    method: 'post',
    data: parameter,
    headers: {
       // json类型
      'Content-Type': 'application/json'
    }
  })
}