import { request } from "@/utils/service"

/** 获取文章列表 */
export function getArticleList(params) {
  return request({
    url: "/story/list",
    method: "get",
    params
  })
}

/** 文章新增或更新
 *  title: 文章标题
 *  content: 文章内容（html格式)
 *  id: 新增 - null, 更新传文章id
 *  status: 未知
 *  storyType: 未知
 *  userId: 选择的虚拟用户id
 */
export function articleUpdate(data) {
  return request({
    url: "/story/save",
    method: "post",
    data
  })
}
/**
 * 删除文章
 * @param {*} articleId
 * @returns
 */
export function deleteArticle(articleId) {
  return request({
    url: `/story/delete/${articleId}`,
    method: "delete"
  })
}
/**
 * 文章审核
 * @param status 状态（1：未审核，2：已经审核）
 * @param storyId
 * @returns
 */
export function updateArticleStatus(params) {
  return request({
    url: "/story/status",
    method: "put",
    params
  })
}

/**
 * 获取文章详情
 * @param storyId
 * @returns
 */
export function getArticleDetail(storyId) {
  return request({
    url: `/story/view/${storyId}`,
    method: "get"
  })
}

/** 获取分类列表 */
export function getArticleCatelogList(params) {
  return request({
    url: "/tag/list",
    method: "get",
    params
  })
}

// 新增&编辑分类
export function updateArticleCatelog(data) {
  return request({
    url: "/tag",
    method: "post",
    data
  })
}

// 修改分类状态
export function updateArticleCatelogStatus(data) {
  return request({
    url: "/tag",
    method: "post",
    data
  })
}

/**
 * 删除文章分类
 * @param {*} id
 * @returns
 */
export function deleteArticleCatelog(id) {
  return request({
    url: `/tag/${id}`,
    method: "delete"
  })
}
