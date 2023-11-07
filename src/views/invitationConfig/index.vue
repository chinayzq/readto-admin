<template>
  <div class="signin-task-component app-container">
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="condition" label="条件" />
        <el-table-column prop="prizeCount" label="奖励金币" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link bg size="small" @click="configEditOpen(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <InviteEditDialog :dataset="dialogDatas" @close="dialogClose" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import InviteEditDialog from "./components/inviteEditDialog.vue"

const listLoading = ref(false)
const tableData = ref([
  {
    condition: "邀请成功用户激活",
    prizeCount: 12000
  },
  {
    condition: "您朋友连续3天签到",
    prizeCount: 21000
  },
  {
    condition: "您朋友连续7天，每天阅读3篇文章",
    prizeCount: 55000
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
