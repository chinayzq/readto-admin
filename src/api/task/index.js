import { request } from "@/utils/service"

/** 获取文章列表 */
export function getTaskList(params) {
  return request({
    url: "/task/list",
    method: "get",
    params
  })
}

/** 修改任务显示/隐藏 */
export function taskStatusChange(params) {
  return request({
    url: "/task/status",
    method: "post",
    params
  })
}

/** 任务编辑 */
export function updateTask(params) {
  return request({
    url: "/task/update",
    method: "post",
    params
  })
}
