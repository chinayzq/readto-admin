<template>
  <div class="readtime-task-component app-container">
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="readingDuration" label="阅读时长" />
        <el-table-column prop="prizeCount" label="奖励金币" />
        <el-table-column prop="status" label="开关">
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
    <ReadingTimeEditDialog :dataset="dialogDatas" @close="dialogClose" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import ReadingTimeEditDialog from "./components/readingTimeEditDialog.vue"

const listLoading = ref(false)
const tableData = ref([
  {
    readingDuration: 30,
    prizeCount: 100,
    status: 1
  },
  {
    readingDuration: 60,
    prizeCount: 200,
    status: 1
  },
  {
    readingDuration: 180,
    prizeCount: 600,
    status: 1
  },
  {
    readingDuration: 300,
    prizeCount: 10000,
    status: 1
  },
  {
    readingDuration: 600,
    prizeCount: 20000,
    status: 1
  },
  {
    readingDuration: 1800,
    prizeCount: 60000,
    status: 2
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
.readtime-task-component {
}
</style>
