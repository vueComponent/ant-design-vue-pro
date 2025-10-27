/**
 *  网站配置-基本配置
 * @date 2021年11月17日 上午9:47:10
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  list: '/web/service/list',
  modifyIsShow: '/web/service/isShow/modify',
  remove: '/web/service/operation/remove',
  add: '/web/service/add/add',
  edit: '/web/service/operation/edit',
  imgModifyIsshow: '/web/service/imgConfig/modifyIsshow',
  imgSaveName: '/web/service/imgConfig/saveName',
  uploadImg: '/web/service/imgConfig/uploadImg',
  imgConfigGet: '/web/service/imgConfig/get'
}
/**
*  获取客服二维码信息
* @param {*} parameter
* @returns
*/
export function imgConfigGet (parameter) {
  return request({
    url: Api.imgConfigGet,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
*  上传修改二维码图片
* @param {*} parameter
* @returns
*/
export function uploadImg (parameter) {
  return request({
    url: Api.uploadImg,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
*  保存二维码说明
* @param {*} parameter
* @returns
*/
export function imgSaveName (parameter) {
  return request({
    url: Api.imgSaveName,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
*  修改二维码显示状态
* @param {*} parameter
* @returns
*/
export function imgModifyIsshow (parameter) {
  return request({
    url: Api.imgModifyIsshow,
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
 * 修改显示状态
 * @param {*} parameter
 * @returns
 */
export function modifyIsShow (parameter) {
  return request({
    url: Api.modifyIsShow,
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
