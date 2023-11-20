import { request } from '@/utils/service'

/** 获取金币流水列表 */
export function getGoldFlowList(params) {
  return request({
    url: '/gold/logs',
    method: 'get',
    params
  })
}
