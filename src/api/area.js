/**
 * 地区
 */
import request from '@/utils/request'

const Api = {
  list: '/area/list',
}
 /**
 *  获取地区集合
 * @returns
 */
 export function List (parameter) {
   return request({
     url: Api.list,
     method: 'get',
   })
 }
