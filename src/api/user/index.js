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
