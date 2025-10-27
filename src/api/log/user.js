/**
 *  门店配置-权限配置
 * @date 2021年11月19日 上午11:08:39
 */
import request from '@/utils/request'
import qs from 'qs'

const Api = {
  page: '/log/user/page',
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
