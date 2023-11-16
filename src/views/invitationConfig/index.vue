<template>
  <div class="signin-task-component app-container">
    <div class="search-line">
      <el-row :gutter="20">
        <el-col :span="2">
          <LangSelector @change="langChange" />
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="内容" />
        <el-table-column prop="des" label="描述信息" />
        <el-table-column prop="amount" label="奖励金币" />
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
import { getTaskList } from "@/api/task"
import LangSelector from "@/components/LangSelector/index.vue"

const lang = ref("zh")
const listLoading = ref(false)
const tableData = ref([])
const initDatas = () => {
  listLoading.value = true
  getTaskList({
    page: 1,
    pageSize: 20,
    type: 300,
    idDes: true,
    lang: lang.value,
    orderColumns: "id"
  })
    .then((res) => {
      if (res.code === 1) {
        tableData.value = res.data.records
      }
    })
    .finally(() => {
      listLoading.value = false
    })
}
const langChange = (value) => {
  lang.value = value
  initDatas()
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
.signin-task-component {
  .search-line {
    margin-bottom: 20px;
  }
}
</style>
