<script setup>
import { formatDateTime } from "@/utils"
import { ref } from "vue"
const LiftTheBan = (row) => {
  console.log(row)
}
const listLoading = ref(false)
const tableData = ref([])
</script>

<template>
  <div class="black-list-component">
    <el-table :data="tableData" v-loading="listLoading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="headImg" label="头像">
        <template #default="scope">
          <img class="list-user-icon" v-if="scope.row.headImg" :src="scope.row.headImg" alt="" />
          <img class="list-user-icon" v-else src="@/assets/user/user_default_icon.png" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="nickeName" label="昵称" />
      <el-table-column prop="blockTime" label="封禁时间">
        <template #default="scope">
          <span>{{ formatDateTime(scope.row.blockTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" link bg size="small" @click="LiftTheBan(scope.row)">接触封禁</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
.black-list-component {
  .list-user-icon {
    height: 30px;
    width: 30px;
  }
}
</style>
