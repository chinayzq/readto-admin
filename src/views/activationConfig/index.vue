<template>
  <div class="activation-task-component app-container">
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="condition" label="条件" />
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
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const listLoading = ref(false)
// status： 1-开，2-关
const tableData = ref([
  {
    content: "单击导航",
    condition: "底部导航每个页面点击1次",
    status: 1
  },
  {
    content: "查看文章或心情",
    condition: "点开1次文章或者心情内容",
    status: 1
  },
  {
    content: "点赞文章或心情",
    condition: "给文章或心情点赞",
    status: 2
  },
  {
    content: "签到",
    condition: "进入签到界面签到1次",
    status: 1
  },
  {
    content: "做任务",
    condition: "不限任务内容，做三个以上任务",
    status: 1
  },
  {
    content: "判断真是设备用户",
    condition: "获取设备数据",
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
</script>

<style lang="scss" scoped>
.activation-task-component {
}
</style>
