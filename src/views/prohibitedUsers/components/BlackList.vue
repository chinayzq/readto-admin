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
          <span>{{ formatDateTime(scope.row.blockTime || scope.row.registerTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" link bg size="small" @click="LiftTheBan(scope.row)">接触封禁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
        <el-pagination
          v-model:current-page="pageVO.page"
          background
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
  </div>
</template>

<script setup>
import { formatDateTime } from "@/utils"
import { ref } from "vue"
import { getBlackList, userUnblock } from '@/api/user'
import { ElMessageBox, ElMessage } from "element-plus"

const props = defineProps({
  ip: {
    type: String,
    default() {
      return ''
    }
  }
})

const LiftTheBan = ({id}) => {
  ElMessageBox.confirm("确定解除封禁?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      userUnblock({userId: id}).then(res => {
        if (res.code === 1) {
          ElMessage.success("解除封禁成功！")
          initDatas()
        }
      })
    })
    .catch(() => {
      console.log("cancel the delete！")
    })
}
const listLoading = ref(false)
const tableData = ref([])
const pageVO = ref({
  page: 1,
  pageSize: 10,
  ip: props.ip || null
})
const total = ref(0)
const initDatas = () => {
  listLoading.value = true
  getBlackList( pageVO.value).then(res => {
    if (res.code === 1) {
      tableData.value = res.data.records
      total.value = res.data.total
    }
  }).finally(() => {
    listLoading.value = false
  })
}
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
initDatas()
</script>


<style scoped lang="scss">
.black-list-component {
  .list-user-icon {
    height: 30px;
    width: 30px;
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
}
</style>
