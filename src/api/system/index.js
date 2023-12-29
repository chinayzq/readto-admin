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
    url: '/data/gold/rank',
    method: 'get',
    params
  })
}

/** 获取金币统计 */
export function getUserGoldRank(params) {
  return request({
    url: '/data/gold/summary',
    method: 'get',
    params
  })
}
