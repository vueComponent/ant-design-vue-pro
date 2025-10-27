/**
 *  网站配置-客服配置
 * @date 2021年11月18日 下午3:30:16
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  list: '/web/beian/list',
  save: '/web/beian/save',
  remove: '/web/beian/removeById'
}
/**
*  删除
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
*  保存
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
/**
*  查询全部备案信息
* @returns
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
