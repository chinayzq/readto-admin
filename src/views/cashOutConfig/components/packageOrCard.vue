<template>
  <div class="package-or-card">
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="level" label="提现档位" />
        <el-table-column prop="yn" label="印尼汇盾" />
        <el-table-column prop="flb" label="菲律宾比索" />
        <el-table-column prop="xjp" label="新加坡元" />
        <el-table-column prop="rmb" label="人民币" />
        <el-table-column prop="count" label="限制/次" />
        <el-table-column prop="needVerify" label="是否要审核" />
        <el-table-column prop="status" label="状态">
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
            <el-button type="primary" link bg size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link bg size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const listLoading = ref(false)
const tableData = ref([
  {
    level: 300000,
    yn: 4302,
    flb: 15.67,
    xjp: 0.39,
    rmb: 2.1,
    count: '1次',
    needVerify: '否',
    status: 1
  }
])
// const props = defineProps({
//   tabType: {
//     type: String,
//     default() {
//       return 'package'
//     }
//   }
// })

const initDatas = () => {
  // listLoading.value = true
  // getTaskList({
  //   page: 1,
  //   pageSize: 20,
  //   type: props.tabType
  // })
  //   .then((res) => {
  //     if (res.code === 1) {
  //       tableData.value = res.data.records
  //     }
  //   })
  //   .finally(() => {
  //     listLoading.value = false
  //   })
}
initDatas()
</script>

<style></style>
