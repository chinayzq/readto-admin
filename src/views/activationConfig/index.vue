<template>
  <div class="activation-task-component app-container">
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
        <el-table-column prop="status" label="开关">
          <template #default="scope">
            <el-switch
              :before-change="beforeChangeColumn"
              @change="auditStatusChange(scope.row)"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { getTaskList, taskStatusChange } from "@/api/task"
import { ElMessage } from "element-plus"
import LangSelector from "@/components/LangSelector/index.vue"

const lang = ref("zh")
const listLoading = ref(false)
// status： 1-开，2-关
const tableData = ref([])
const initDatas = () => {
  listLoading.value = true
  getTaskList({
    page: 1,
    pageSize: 20,
    type: 400,
    idDes: false,
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

const switchState = ref(false)
const beforeChangeColumn = () => {
  switchState.value = true
  return switchState.value
}
const auditStatusChange = ({ status, taskId }) => {
  if (!switchState.value) return
  taskStatusChange({
    status,
    lang: lang.value,
    taskId
  }).then((res) => {
    if (res.code === 1) {
      ElMessage.success("修改成功！")
      initDatas()
    }
  })
}
</script>

<style lang="scss" scoped>
.activation-task-component {
  .search-line {
    margin-bottom: 20px;
  }
}
</style>
