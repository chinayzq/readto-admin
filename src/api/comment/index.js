import { request } from "@/utils/service"

/** 获取一级评论列表 */
export function getCommentFirstList(params) {
  return request({
    url: "/comment/first/list",
    method: "get",
    params
  })
}

/** 获取一级评论列表 */
export function deleteCommentFirst(params) {
  return request({
    url: "/comment/first/del",
    method: "get",
    params
  })
}

/**
 * 一级评论审核
 * @param id comment id
 * @param reason
 * @param status 1:通过，2: 不通过
 */
export function statusCommentFirst(params) {
  return request({
    url: "/comment/first/status",
    method: "get",
    params
  })
}
