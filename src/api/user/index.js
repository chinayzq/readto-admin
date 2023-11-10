import { request } from "@/utils/service"

/** 获取用户列表 */
export function getUserList(params) {
  return request({
    url: "/user/list",
    method: "get",
    params
  })
}

/** 获取虚拟用户列表 */
export function getVirtuallyUserList(params) {
  return request({
    url: "/users/dropdown",
    method: "get",
    params
  })
}

/** 获取用户详情 */
export function getUserDetail(params) {
  return request({
    url: "/user/info",
    method: "get",
    params
  })
}

/** 修改用户状态 */
export function changeUserStatus(data) {
  return request({
    url: "/user/status",
    method: "post",
    data
  })
}

/** 用户金币操作 */
export function userGoldOperation(data) {
  return request({
    url: "/gold/edit",
    method: "post",
    data
  })
}
