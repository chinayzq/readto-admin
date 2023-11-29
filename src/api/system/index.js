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
