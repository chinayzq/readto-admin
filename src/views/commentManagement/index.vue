<template>
  <div class="comment-management app-container">
    <div class="search-line">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-select v-model="status" placeholder="审核" clearable @change="initDatas">
            <el-option v-for="item in verifyOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="keyword" clearable @input="initDatas" placeholder="输入评论人/文章标题" />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" :icon="Search" @click="initDatas">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="文章/心情标题">
          <template #default="scope">
            <span class="link-button" @click="linkButtonClick(scope.row.name)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="发表人">
          <template #default="scope">
            <span class="link-button" @click="linkButtonClick(scope.row.author)">{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="comSumCount" label="评价内容" />
        <el-table-column prop="readingUserCount" label="点赞数" width="100" />
        <el-table-column prop="replyCount" label="回复数" width="100">
          <template #default="scope">
            <span class="link-button" @click="replyDialogOpen(scope.row)">{{ scope.row.replyCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="publish" label="发表时间" width="200">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.publish) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核" width="100">
          <template #default="scope">
            <el-switch
              @change="auditStatusChange(scope.row)"
              v-model="scope.row.status"
              :active-value="2"
              :inactive-value="1"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="danger" link bg size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pageVO.page"
          background
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <CommentReplyDialog :dataset="replyDialog" @close="replyDialogClose" />
  </div>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue"
import { ref } from "vue"
import { ElMessageBox, ElMessage } from "element-plus"
import { formatDateTime } from "@/utils"
import CommentReplyDialog from "./components/commentReplyDialog.vue"
import { getCommentFirstList } from "@/api/comment"
//#region 查询
const keyword = ref(null)
const tableData = ref([])
const status = ref(null)
const listLoading = ref(false)
const total = ref(0)
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const verifyOption = ref([
  {
    label: "全部",
    value: ""
  },
  {
    label: "审核通过",
    value: 2
  },
  {
    label: "未审核",
    value: 1
  }
])
const initDatas = () => {
  listLoading.value = true
  getCommentFirstList(pageVO.value)
    .then((res) => {
      tableData.value = res.data.records
      total.value = res.data.total
    })
    .finally(() => {
      listLoading.value = false
    })
}
initDatas()
const linkButtonClick = (key) => {
  keyword.value = key
  initDatas()
}
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
//#endregion

//#region 删除、修改状态
const handleDelete = ({ id }) => {
  ElMessageBox.confirm("确定删除该文章?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      // deleteArticle(id).then(() => {
      //   ElMessage.success("删除成功！")
      //   initDatas()
      // })
    })
    .catch(() => {
      console.log("cancel the delete！")
    })
}
const auditStatusChange = ({ id, status }) => {
  // updateArticleStatus({
  //   status,
  //   storyId: id
  // }).then((res) => {
  //   if (res.code === 1) {
  //     ElMessage.success("状态更新成功！")
  //   }
  // })
}
//#endregion

//#region 查看回复
const replyDialog = ref({
  show: false,
  id: null
})
const replyDialogOpen = ({ id }) => {
  replyDialog.value.id = id
  replyDialog.value.show = true
}
const replyDialogClose = () => {
  replyDialog.value.show = false
}
//#endregion
</script>

<style lang="scss" scoped>
.comment-management {
  .search-line {
    margin-bottom: 20px;
  }
  .table-container {
    .link-button {
      color: #409eff;
      cursor: pointer;
    }
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
}
</style>
