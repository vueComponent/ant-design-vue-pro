/**
 * 公用接口
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  version: '/version.json',
  createKey: '/createKey',
  listMenuProductCata: '/listMenuProductCata',
  subToken: '/subToken',
  listGoodsByProductId: '/listGoodsByProductId',
  listProductAreaByFid: '/listProductAreaByFid',
  listQueryTpl: '/listQueryTpl',
  productTypeEnum: '/productTypeEnum',
  productCateList: '/productCateList',
  productCateChildren: '/productCateChildren',
  queryTypeEnum: '/queryTypeEnum',
  operatorList: '/operatorList',
  // 获取业务价格分组集合
  businessPriceGroupList: '/businessPriceGroupList',
  // 获取地区集合
  areaList: '/areaList',
}

/**
 *  获取地区集合
 */
export function AreaList () {
  return request({
    url: Api.areaList,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 获取业务价格组列表
 * @returns 返回一个Promise对象，包含请求结果
 */
export function BusinessPriceGroupList () {
  return request({
    url: Api.businessPriceGroupList,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
  * 按运营商类型获取运营商
  * @returns
  */
export function OperatorList (parameter) {
  return request({
    url: Api.operatorList,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
  * 获取全部类型
  * @param {*} parameter
  * @returns
  */
 export function QueryTypeEnum (parameter) {
  return request({
    url: Api.queryTypeEnum,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取全部类目Childre
 * @returns
 */
 export function ProductCateChildren () {
  return request({
    url: Api.productCateChildren,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取全部类目
 * @returns
 */
 export function ProductCateList () {
  return request({
    url: Api.productCateList,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取产品类型枚举
 * @returns
 */
export function ProductTypeEnum () {
  return request({
    url: Api.productTypeEnum,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取全部查询模板
 * @returns
 */
export function listQueryTpl () {
  return request({
    url: Api.listQueryTpl,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 版本
 * @returns
 */
 export function version () {
  return request({
    url: Api.version,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取产品地区
 * @param {*} parameter
 * @returns
 */
 export function listProductAreaByFid (parameter) {
  return request({
    url: Api.listProductAreaByFid,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 按产品id获取商品集合
 * @param {*} parameter
 * @returns
 */
 export function listGoodsByProductId (parameter) {
  return request({
    url: Api.listGoodsByProductId,
    method: 'post',
    data: qs.stringify(parameter),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取提交token
 * @returns
 */
 export function subToken () {
  return request({
    url: Api.subToken,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 获取菜单商品分类
 * @returns
 */
 export function listMenuProductCata () {
  return request({
    url: Api.listMenuProductCata,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 生成key
 * @returns
 */
 export function CreateKey () {
  return request({
    url: Api.createKey,
    method: 'get',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
