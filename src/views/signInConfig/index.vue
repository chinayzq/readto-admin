<template>
  <div class="signin-task-component app-container">
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="days" label="天数" />
        <el-table-column prop="prizeCount" label="奖励金币" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link bg size="small" @click="configEditOpen(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <SigninEditDialog :dataset="dialogDatas" @close="dialogClose" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import SigninEditDialog from "./components/signinEditDialog.vue"

const listLoading = ref(false)
const tableData = ref([
  {
    days: "第一天",
    prizeCount: 50
  },
  {
    days: "第二天",
    prizeCount: 100
  },
  {
    days: "第三天",
    prizeCount: 150
  },
  {
    days: "第四天",
    prizeCount: 200
  },
  {
    days: "第五天",
    prizeCount: 300
  },
  {
    days: "第六天",
    prizeCount: 400
  },
  {
    days: "第七天",
    prizeCount: 500
  }
])
const initDatas = () => {
  listLoading.value = true
  setTimeout(() => {
    listLoading.value = false
  }, 1000)
}
initDatas()

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
.signin-task-component {
}
</style>
