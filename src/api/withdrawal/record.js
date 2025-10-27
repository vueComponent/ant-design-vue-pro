/**
 * 查询-查询配置
 * @date 2021年11月2日 上午9:50:33
 */
 import request from '@/utils/request'
 import qs from 'qs'

 const Api = {
   // 分页
   page: '/withdrawal/record/page',
   
   // 修改状态
   modifyState: '/withdrawal/record/modifyState'
 }

 /**
  * 修改状态
  * @param {*} parameter
  * @returns
  */
  export function ModifyState (parameter) {
    return request({
      url: Api.modifyState,
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
 export function Page (parameter) {
   return request({
     url: Api.page + '?' + qs.stringify(parameter),
     method: 'get',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
     }
   })
 }
