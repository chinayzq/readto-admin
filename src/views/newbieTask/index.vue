<template>
  <div class="newbie-task-component app-container">
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="description" label="描述信息" />
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
    <ConfigEditDialog :dataset="dialogDatas" @close="dialogClose" />
  </div>
</template>

<script setup>
import { ref } from "vue"
import ConfigEditDialog from "./components/configEditDialog.vue"

const listLoading = ref(false)
const tableData = ref([
  {
    content: "绑定邮箱",
    description: "绑定邮箱即可获得奖励",
    prizeCount: 50,
    status: 1
  },
  {
    content: "绑定Google账号",
    description: "绑定Google账号即可获得奖励",
    prizeCount: 50,
    status: 1
  },
  {
    content: "完善资料",
    description: "完善资料即可获得奖励",
    prizeCount: 50,
    status: 1
  },
  {
    content: "绑定手机号",
    description: "绑定手机号即可获得奖励",
    prizeCount: 50,
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
.newbie-task-component {
}
</style>
