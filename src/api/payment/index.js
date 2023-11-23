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

/** 获取汇率列表 */
export function getRateList(params) {
  return request({
    url: '/rate/list',
    method: 'get',
    params
  })
}

/** 修改汇率状态 */
export function updateRateStatus(params) {
  return request({
    url: '/rate/status',
    method: 'post',
    params
  })
}

/** 获取金币兑换美元汇率 */
export function getUsdRate(params) {
  return request({
    url: '/system/usd',
    method: 'get',
    params
  })
}

/** 设置金币兑换美元汇率 */
export function setUsdRate(params) {
  return request({
    url: '/system/usd',
    method: 'post',
    params
  })
}

/** 获取金币兑换列表 */
export function getMoneyChargeRateList(params) {
  return request({
    url: '/system/rate',
    method: 'get',
    params
  })
}

/** 设置金币兑换各币种汇率 */
export function setMoneyChargeRate(params) {
  return request({
    url: '/system/rate',
    method: 'post',
    params
  })
}
