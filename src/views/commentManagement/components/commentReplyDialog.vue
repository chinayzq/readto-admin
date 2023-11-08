<template>
  <div class="comment-reply-dialog">
    <el-dialog
      v-model="datas.show"
      :close-on-click-modal="false"
      title="回复列表"
      width="1200"
      :before-close="handleClose"
    >
      <div class="dialog-container" v-loading="listLoading">
        <el-row :gutter="20">
          <el-col :span="12" class="single-item">
            <span class="label">文章标题：</span>
            <span class="value">{{ replyDetails.name }}</span>
          </el-col>
          <el-col :span="12" class="single-item">
            <span class="label">发表人：</span>
            <span class="value">{{ replyDetails.userNickeName }}</span>
          </el-col>
          <el-col :span="12" class="single-item">
            <span class="label">发表日期：</span>
            <span class="value">{{ formatDateTime(replyDetails.createTime) }}</span>
          </el-col>
          <el-col :span="12" class="single-item">
            <span class="label">回复数：</span>
            <span class="value">{{ replyDetails.subComCount }}</span>
          </el-col>
          <el-col :span="24" class="single-item">
            <span class="label">评价内容：</span>
            <span class="value">{{ replyDetails.commentsContent }}</span>
          </el-col>
        </el-row>
        <div class="table-container">
          <el-table :data="tableData">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="userNickeName" label="回复人" width="140" />
            <el-table-column prop="commentsContent" label="评价内容" show-overflow-tooltip />
            <el-table-column prop="likes" label="点赞数" width="100" />
            <el-table-column prop="createTime" label="发表时间" width="200">
              <template #default="scope">
                <span>{{ formatDateTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="审核" width="100">
              <template #default="scope">
                <el-switch
                  @change="auditStatusChange(scope.row)"
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="2"
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
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { formatDateTime } from "@/utils"
import { computed, ref, watch } from "vue"
import { getCommentSecondList, deleteSecondComment } from "@/api/comment"
import { ElMessageBox, ElMessage } from "element-plus"
const datas = computed(() => props.dataset)
const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {}
    }
  }
})
const emit = defineEmits(["close"])
const handleClose = () => {
  emit("close")
}

//#region 查询
const commentId = ref(null)
watch(
  () => props.dataset,
  (datas) => {
    if (datas.id) {
      if (datas.id) {
        commentId.value = datas.id
        initDatas()
      }
      displayCommentDetails(datas.datas)
    }
  },
  { deep: true }
)
const listLoading = ref(false)
const tableData = ref([])
const total = ref(0)
const pageVO = ref({
  page: 1,
  size: 10
})
const replyDetails = ref({
  name: "这是一个文章标题这是一个文章标题",
  userNickeName: "刘德华",
  createTime: new Date().getTime(),
  subComCount: 888,
  commentsContent: "这是一个文章标题这是一个文章标题这是一个文章标题这是一个文章标题这是一个文章标题这是一个文章标题"
})
const displayCommentDetails = (datas) => {
  replyDetails.value = datas
}
const initDatas = () => {
  listLoading.value = true
  getCommentSecondList({ ...{ commentId: commentId.value }, ...pageVO.value })
    .then((res) => {
      if (res.code === 1) {
        tableData.value = res.data.records
        total.value = res.data.total
      }
    })
    .finally(() => {
      listLoading.value = false
    })
}
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
// initDatas()
//#endregion

//#region 修改、删除
const auditStatusChange = () => {}
const handleDelete = ({ id }) => {
  ElMessageBox.confirm("确定删除该评论?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteSecondComment({ id }).then(() => {
        ElMessage.success("删除成功！")
        initDatas()
      })
    })
    .catch(() => {
      console.log("cancel the delete！")
    })
}
//#endregion
</script>

<style lang="scss" scoped>
.comment-reply-dialog {
  .dialog-container {
    .single-item {
      display: flex;
      margin-bottom: 20px;
      .label {
        display: inline-block;
        width: 70px;
      }
    }
    .table-container {
      margin-top: 10px;
    }
    .pagination-container {
      display: flex;
      justify-content: center;
      margin: 15px 0;
    }
  }
}
</style>
