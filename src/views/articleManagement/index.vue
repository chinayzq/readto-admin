<template>
  <div class="article-management app-container">
    <div class="search-line">
      <el-row :gutter="20">
        <el-col :span="2">
          <el-select v-model="verifyValue" placeholder="审核">
            <el-option v-for="item in verifyOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="searchKey" placeholder="输入标题搜索文章" />
        </el-col>
        <el-col :span="5">
          <el-button type="primary" :icon="Search">查询</el-button>
          <el-button type="primary" :icon="Plus" @click="addNewArticle">新增文章</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-table :data="tableData">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="articleTitle" label="标题" />
        <el-table-column prop="author" label="作者" />
        <el-table-column prop="commentsCount" label="评论数" />
        <el-table-column prop="pageView" label="浏览量" />
        <el-table-column prop="likeCount" label="点赞" />
        <el-table-column prop="createTime" label="发布时间" />
        <el-table-column prop="auditStatus" label="审核">
          <template #default="scope">
            <el-switch
              @change="auditStatusChange"
              v-model="scope.row.auditStatus"
              :active-value="1"
              :inactive-value="2"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link bg size="small" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger" link bg size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ArticleDialog :dialogVisible="dialogVisible" @close="modelCloaseHandler" :dataset="dialogData" />
  </div>
</template>

<script setup>
import { Search, Plus } from "@element-plus/icons-vue"
import { ref } from "vue"
import { ElMessageBox, ElMessage } from "element-plus"
import ArticleDialog from "./components/articleDialog.vue"
// auditStatus - 1: 通过，2: 未审核
const tableData = ref([
  {
    articleTitle: "测试标题",
    author: "刘德华",
    commentsCount: 100,
    pageView: 2000,
    likeCount: 1400,
    createTime: "2023-10-27 08:00:00",
    auditStatus: 1
  },
  {
    articleTitle: "测试标题2",
    author: "张学友",
    commentsCount: 100,
    pageView: 2000,
    likeCount: 1400,
    createTime: "2023-10-27 08:00:00",
    auditStatus: 2
  }
])

const verifyValue = ref(null)
const verifyOption = ref([
  {
    label: "全部",
    value: 1
  },
  {
    label: "审核通过",
    value: 2
  },
  {
    label: "未审核",
    value: 3
  }
])

const searchKey = ref(null)

const handleDelete = (item) => {
  ElMessageBox.confirm("确定删除该文章?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      ElMessage.success("删除成功！")
      console.log("item", item)
    })
    .catch(() => {
      console.log("cancel the delete！")
    })
}

const auditStatusChange = (value) => {
  console.log("value", value)
}

const dialogVisible = ref(false)
const dialogData = ref({
  title: "新增文章",
  datas: {}
})
const addNewArticle = () => {
  dialogData.value.title = "新增文章"
  dialogVisible.value = true
}
const modelCloaseHandler = () => {
  dialogVisible.value = false
}
const handleUpdate = (item) => {
  dialogData.value.title = "编辑文章"
  dialogData.value.datas = item
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.article-management {
  .search-line {
    margin-bottom: 20px;
  }
}
</style>
