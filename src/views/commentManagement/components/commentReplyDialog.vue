<template>
  <div class="comment-reply-dialog">
    <el-dialog
      v-model="props.dataset.show"
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
            <span class="value">{{ replyDetails.auther }}</span>
          </el-col>
          <el-col :span="12" class="single-item">
            <span class="label">发表日期：</span>
            <span class="value">{{ formatDateTime(replyDetails.publish) }}</span>
          </el-col>
          <el-col :span="12" class="single-item">
            <span class="label">回复数：</span>
            <span class="value">{{ replyDetails.replyCount }}</span>
          </el-col>
          <el-col :span="24" class="single-item">
            <span class="label">评价内容：</span>
            <span class="value">{{ replyDetails.replyDetail }}</span>
          </el-col>
        </el-row>
        <div class="table-container">
          <el-table :data="tableData">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="author" label="回复人" />
            <el-table-column prop="comSumCount" label="评价内容" />
            <el-table-column prop="readingUserCount" label="点赞数" width="100" />
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
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { formatDateTime } from "@/utils"
import { ref, watch } from "vue"

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
watch(
  () => props.dataset,
  (datas) => {
    if (datas.id) {
      initDatas(datas.id)
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
  auther: "刘德华",
  publish: new Date().getTime(),
  replyCount: 888,
  replyDetail: "这是一个文章标题这是一个文章标题这是一个文章标题这是一个文章标题这是一个文章标题这是一个文章标题"
})
const initDatas = (id) => {
  console.log(111)
  listLoading.value = true
  setTimeout(() => {
    listLoading.value = false
  }, 1000)
}
initDatas()
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
