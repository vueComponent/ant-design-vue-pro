/**
 * 设备服务接口
 */
 import request from '@/utils/request'

 const Api = {
   serviceApi: '/device/serviceApi',
   get: '/device/serviceApi/get'
 }

 /**
  * 保存
  * @param {*} parameter
  * @returns
  */
  export function Save (parameter) {
    return request({
      url: Api.serviceApi,
      method: 'post',
      data: parameter,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }
 /**
  * 获取配置
  * @returns
  */
 export function Get () {
   return request({
     url: Api.get,
     method: 'post',
     headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
   })
 }
