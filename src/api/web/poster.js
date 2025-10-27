/**
 *  网站配置-基本配置
 * @date 2021年11月17日 上午9:47:10
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  list: '/web/poster/list',
  remove: '/web/poster/remove/byId',
  add: '/web/poster/add/add',
  edit: '/web/poster/edit/byId',
  getCreatePosterImg: '/web/poster/modify/getCreatePosterImg',
  modifyMosterConfig: '/web/poster/modify/posterConfig',
  modifyState: '/web/poster/state/modify'
}
/**
*  修改状态
* @param {*} parameter
* @returns
*/
export function modifyState (parameter) {
  return request({
    url: Api.modifyState,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
*  海报参数修改
* @param {*} parameter
* @returns
*/
export function modifyMosterConfig (parameter) {
  return request({
    url: Api.modifyMosterConfig,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
*  查看生成的海报
* @param {*} parameter
* @returns
*/
export function getCreatePosterImg (parameter) {
  return request({
    url: Api.getCreatePosterImg,
    method: 'post',
    data: qs.stringify(parameter),
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
*  删除
* @param {*} parameter
* @returns
*/
export function remove (parameter) {
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
* 查询全部客服
* @returns
*/
export function list () {
  return request({
    url: Api.list,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
