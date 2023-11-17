<script setup>
import { formatDateTime } from "@/utils"
import { CirclePlus } from "@element-plus/icons-vue"
import { ref } from "vue"
import BanDialog from "./BanDialog.vue"
const LiftTheBan = (row) => {
  console.log(row)
}

const banDialogShow = ref(false)
const addBan = () => {
  banDialogShow.value = true
}
const dialogClose = (fresh) => {
  banDialogShow.value = false
  if (fresh === true) {
    initDatas()
  }
}
const listLoading = ref(false)
const tableData = ref([])
const initDatas = () => {
  listLoading.value = true
  setTimeout(() => {
    listLoading.value = false
  }, 1000)
}
</script>

<template>
  <div class="ip-blocking-component">
    <div class="button-line">
      <el-button type="primary" :icon="CirclePlus" @click="addBan">新增封禁</el-button>
    </div>
    <el-table :data="tableData" v-loading="listLoading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="ip" label="被封禁IP" />
      <el-table-column prop="address" label="所在地区" />
      <el-table-column prop="userTotal" label="封禁用户数" />
      <el-table-column prop="status" label="禁止新注册">
        <template #default="scope">
          <span>{{ scope.row.status === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="封禁时间">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" link bg size="small" @click="LiftTheBan(scope.row)">接触封禁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <BanDialog :show="banDialogShow" @close="dialogClose" />
  </div>
</template>

<style scoped lang="scss">
.ip-blocking-component {
  .button-line {
    margin-bottom: 15px;
  }
}
</style>
