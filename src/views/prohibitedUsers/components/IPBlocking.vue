<template>
  <div class="ip-blocking-component">
    <div class="button-line">
      <el-button type="primary" :icon="CirclePlus" @click="addBan">新增封禁</el-button>
    </div>
    <el-table :data="tableData" v-loading="listLoading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="ip" label="被封禁IP" />
      <el-table-column prop="address" label="所在地区" />
      <el-table-column prop="userTotal" label="封禁用户数">
        <template #default="scope">
          <span class="link-span" @click="getIpUserList(scope.row)">{{ scope.row.userTotal }}</span>
        </template>
      </el-table-column>
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
    <div class="pagination-container">
      <el-pagination v-model:current-page="pageVO.page" background layout="total, prev, pager, next" :total="total"
        @current-change="handleCurrentChange" />
    </div>
    <BanDialog :show="banDialogShow" @close="dialogClose" />
  </div>
</template>

<script setup>
import { formatDateTime } from "@/utils"
import { CirclePlus } from "@element-plus/icons-vue"
import { ref } from "vue"
import { getIpBlockingList, ipUnblock } from '@/api/user'
import { ElMessageBox, ElMessage } from "element-plus"

import BanDialog from "./BanDialog.vue"
const LiftTheBan = ({ ip }) => {
  ElMessageBox.confirm("确定解除封禁?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      ipUnblock({ ip }).then(res => {
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
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const initDatas = () => {
  listLoading.value = true
  getIpBlockingList(pageVO.value).then(res => {
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

const emit = defineEmits(['getBottomList'])
const getIpUserList = (row) => {
  emit('getBottomList', row)
}
</script>

<style scoped lang="scss">
.ip-blocking-component {
  .button-line {
    margin-bottom: 15px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
  .link-span {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
