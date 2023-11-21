import { request } from '@/utils/service'

/** 获取金币流水列表 */
export function getGoldFlowList(params) {
  return request({
    url: '/gold/logs',
    method: 'get',
    params
  })
}

/** 获取提现列表 */
export function getPayList(params) {
  return request({
    url: '/pay/list',
    method: 'get',
    params
  })
}

/** 提现审核 */
export function payCheck(params) {
  return request({
    url: '/pay/checked',
    method: 'post',
    params
  })
}

/** 获取提现详情 */
export function getPayDetailById(params) {
  return request({
    url: '/pay/info',
    method: 'get',
    params
  })
}
