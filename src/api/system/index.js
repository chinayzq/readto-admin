import { request } from '@/utils/service'

/** 获取系统配置列表 */
export function getSysConfigList(params) {
  return request({
    url: '/system/config',
    method: 'get',
    params
  })
}

/** 获取系统配置列表 */
export function sysConfigUpdate(data) {
  return request({
    url: '/system/config',
    method: 'post',
    data
  })
}

/** 获取金币榜 */
export function getUserGoldList(params) {
  return request({
    url: '/summary/gold/list',
    method: 'get',
    params
  })
}
