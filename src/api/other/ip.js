/**
 * 商品-产品管理
 * @date 2021年11月15日 上午10:37:36
 */
 import request from '@/utils/request'
 import qs from 'qs'

 const Api = {
  page: '/other/ip/page',
  edit: '/other/ip/edit/byId'
 }
  /**
  *  编辑
  * @param {*} parameter
  * @returns
  */
  export function edit (parameter) {
    return request({
      url: Api.edit,
      method: 'post',
      data: qs.stringify(parameter),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  }
 /**
  * 分页
  * @param {*} parameter
  * @returns
  */
  export function page (parameter) {
    return request({
      url: Api.page,
      method: 'post',
      data: qs.stringify(parameter),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  }
