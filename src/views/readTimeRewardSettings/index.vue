<template>
  <div class="readtime-task-component app-container">
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
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link bg size="small" @click="configEditOpen(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ReadingTimeEditDialog :dataset="dialogDatas" @close="dialogClose" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import ReadingTimeEditDialog from "./components/readingTimeEditDialog.vue"
import { getTaskList, taskStatusChange } from "@/api/task"
import { ElMessage } from "element-plus"
import LangSelector from "@/components/LangSelector/index.vue"

const lang = ref("zh")
const listLoading = ref(false)
const tableData = ref([])
const initDatas = () => {
  listLoading.value = true
  getTaskList({
    page: 1,
    pageSize: 20,
    type: 500,
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
.readtime-task-component {
  .search-line {
    margin-bottom: 20px;
  }
}
</style>
