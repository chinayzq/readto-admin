<template>
  <div class="daily-task-component app-container">
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="condition" label="条件" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="prizeCount" label="奖励金币" />
        <el-table-column prop="status" label="状态">
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
            <el-button type="primary" link bg size="small" @click="configEditOpen(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DailyConfigDialog :dataset="dialogDatas" @close="dialogClose" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import DailyConfigDialog from "./components/dailyConfigDialog.vue"

const listLoading = ref(false)
const tableData = ref([
  {
    content: "发表文章",
    condition: 1,
    unit: "篇",
    prizeCount: 50,
    status: 1
  },
  {
    content: "发表交友",
    condition: 1,
    unit: "篇",
    prizeCount: 50,
    status: 1
  },
  {
    content: "评论",
    condition: 3,
    unit: "条",
    prizeCount: 100,
    status: 1
  },
  {
    content: "喜欢交友",
    condition: 5,
    unit: "篇",
    prizeCount: 100,
    status: 1
  },
  {
    content: "每日邀请朋友",
    condition: 5,
    unit: "人",
    prizeCount: 100,
    status: 1
  },
  {
    content: "看视频广告",
    condition: 30,
    unit: "秒",
    prizeCount: 100,
    status: 1
  }
])
const initDatas = () => {
  listLoading.value = true
  setTimeout(() => {
    listLoading.value = false
  }, 1000)
}
initDatas()

const auditStatusChange = ({ status }) => {
  console.log("status", status)
}

const dialogDatas = ref({
  show: false,
  datas: {}
})
const configEditOpen = (row) => {
  console.log("row", row)
  dialogDatas.value.datas = row
  dialogDatas.value.show = true
}
const dialogClose = (fresh) => {
  dialogDatas.value.show = false
  if (fresh === true) {
    initDatas()
  }
}
</script>

<style lang="scss" scoped>
.daily-task-component {
}
</style>
