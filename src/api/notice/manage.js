/**
 *  公告-公告管理
 * @date 2021年11月16日 下午12:23:05
 */
 import request from '@/utils/request'
 import qs from 'qs'

 const Api = {
  page: '/notice/manage/page',
  remove: '/notice/manage/removeById',
  save: '/notice/manage/save',
  getById: '/notice/manage/getById'
 }
 /**
  *  按id查询公告信息
  * @param {*} parameter
  * @returns
  */
 export function GetById (parameter) {
  return request({
    url: Api.getById,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
 /**
  *  发布或编辑
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
  * @param {*} parameter
  * @returns
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
  * @param {*} parameter
  * @returns
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
