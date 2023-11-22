<template>
  <div class="app-container exchange-rate">
    <div class="dollar-rate-line">
      <span class="first-label"> 修改汇率比例 1美元= </span>
      <span>
        <el-input style="display: inline" v-model="dollarGoldMount" />
      </span>
      <span> 金币 </span>
      <el-button type="primary" style="margin-left: 15px">更新</el-button>
      <el-button>更新日志</el-button>
    </div>
    <el-table :data="tableData" v-loading="listLoading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="whichMoney" label="币种单位" />
      <el-table-column prop="dollarRate" label="美元汇率" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" link bg size="small" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getRateList } from '@/api/payment'
const dollarGoldMount = ref(0)
const tableLoading = ref(false)
const tableData = ref([])
const initDatas = () => {
  tableLoading.value = true
  getRateList({
    page: 1,
    pageSize: 10,
    lang: 'id'
  })
    .then((res) => {
      console.log(res)
    })
    .finally(() => {
      tableLoading.value = false
    })
}
initDatas()
</script>

<style scoped lang="scss">
.exchange-rate {
  .dollar-rate-line {
    margin-bottom: 15px;
    font-size: 14px;
  }
}
</style>
