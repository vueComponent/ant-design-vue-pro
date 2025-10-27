/**
 * 商品-产品管理
 * @date 2021年11月15日 上午10:37:36
 */
 import request from '@/utils/request'
 import qs from 'qs'

 const Api = {
  page: '/other/segment/page',
  batchRemove: '/other/segment/remove/batch',
  add: '/other/segment/add/add',
  edit: '/other/segment/edit/byId',
  batchModifyMobileType: '/other/segment/batchModifyMobileType/byIds',
  operatorList: '/other/segment/operatorList'
 }
 /**
  *  批量修改运营商
  * @param {*} parameter
  * @returns
  */
  export function batchModifyMobileType (parameter) {
    return request({
      url: Api.batchModifyMobileType,
      method: 'post',
      data: parameter,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  }
  /**
  *  获取运营商类型
  * @returns
  */
   export function operatorList (parameter) {
    return request({
      url: Api.operatorList,
      method: 'get',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
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
  *  添加
  * @param {*} parameter
  * @returns
  */
  export function add (parameter) {
    return request({
      url: Api.add,
      method: 'post',
      data: qs.stringify(parameter),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
  }
  /**
  * 批量删除
  * @param {*} parameter
  * @returns
  */
  export function batchRemove (parameter) {
    return request({
      url: Api.batchRemove,
      method: 'post',
      data: parameter,
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
