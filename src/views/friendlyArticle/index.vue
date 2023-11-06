<template>
  <div class="friendly-article-management app-container">
    <div class="search-line">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-select v-model="status" placeholder="审核" clearable @change="initDatas">
            <el-option v-for="item in verifyOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="keyword" clearable @input="initDatas" placeholder="输入标题/作者搜索文章" />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" :icon="Search" @click="initDatas">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="标题">
          <template #default="scope">
            <span class="link-button" @click="articlePreviewOpen(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者">
          <template #default="scope">
            <span class="link-button" @click="linkButtonClick(scope.row.author)">{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="comSumCount" label="评论数" width="100" />
        <el-table-column prop="readingUserCount" label="浏览量" width="100" />
        <el-table-column prop="praise" label="点赞" width="100" />
        <el-table-column prop="publish" label="发布时间" width="200">
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
            <el-button type="primary" link bg size="small" @click="articleEditOpen(scope.row)">编辑</el-button>
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
</template>

<script setup>
import { Search } from "@element-plus/icons-vue"
import { ref } from "vue"
import { ElMessageBox, ElMessage } from "element-plus"
import { getArticleList, deleteArticle, updateArticleStatus } from "@/api/article"
import { formatDateTime } from "@/utils"
//#region 查询
// status - 1: 未审核，2: 已审核
const keyword = ref(null)
const tableData = ref([])
const status = ref(null)
const listLoading = ref(false)
const pageVO = ref({
  page: 1,
  size: 10
})
const total = ref(0)
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
  getArticleList({
    ...{
      storyType: 2,
      keyword: keyword.value,
      status: status.value,
      sortBy: "publish",
      sortOrder: "desc"
    },
    ...pageVO.value
  })
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
      deleteArticle(id).then(() => {
        ElMessage.success("删除成功！")
        initDatas()
      })
    })
    .catch(() => {
      console.log("cancel the delete！")
    })
}
const auditStatusChange = ({ id, status }) => {
  updateArticleStatus({
    status,
    storyId: id
  }).then((res) => {
    if (res.code === 1) {
      ElMessage.success("状态更新成功！")
    }
  })
}
//#endregion
</script>

<style lang="scss" scoped>
.friendly-article-management {
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