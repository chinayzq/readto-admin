import { request } from '@/utils/service'

/** 获取用户列表 */
export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

/** 获取虚拟用户列表 */
export function getVirtuallyUserList(params) {
  return request({
    url: '/users/dropdown',
    method: 'get',
    params
  })
}

/** 获取用户详情 */
export function getUserDetail(params) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  })
}

/** 修改用户状态 */
export function changeUserStatus(data) {
  return request({
    url: '/user/status',
    method: 'post',
    data
  })
}

/** 用户金币操作 */
export function userGoldOperation(data) {
  return request({
    url: '/gold/edit',
    method: 'post',
    data
  })
}

/** 获取IP封禁列表 */
export function getIpBlockingList(params) {
  return request({
    url: '/ip/block/list',
    method: 'get',
    params
  })
}

/** 获取黑名单列表 */
export function getBlackList(params) {
  return request({
    url: '/user/block/list',
    method: 'get',
    params
  })
}

/** 黑名单解除封禁 */
export function userUnblock(data) {
  return request({
    url: '/user/unblock',
    method: 'post',
    data
  })
}

/** 新增IP封禁 */
export function addIpBlocking(data) {
  return request({
    url: '/ip/block',
    method: 'post',
    data
  })
}

/** 根据IP获取地址 */
export function getAddressByIp(params) {
  return request({
    url: '/ip/address',
    method: 'get',
    params
  })
}

/** 根据IP获取用户数 */
export function getUserCountByIp(params) {
  return request({
    url: '/user/block/count',
    method: 'get',
    params
  })
}

/** ip解除封禁 */
export function ipUnblock(data) {
  return request({
    url: '/ip/unblock',
    method: 'post',
    data
  })
}

// /** 用户活跃列表 */
// export function getLiveUserList(params) {
//   return request({
//     url: '/user/live/sum/list',
//     method: 'get',
//     params
//   })
// }

/** 用户活跃列表 */
export function getLiveUserList(params) {
  return request({
    url: '/user/live/summary',
    method: 'get',
    params
  })
}
