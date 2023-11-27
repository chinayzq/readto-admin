<template>
  <div class="app-container statistical-gold">
    <el-row :gutter="20" class="search-line">
      <el-col :span="6">
        <el-date-picker
          v-model="searchForm.date"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd"
        />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="initDatas">查询</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="comSumCount" label="日期" />
        <el-table-column prop="comSumCount" label="共发行" />
        <el-table-column prop="comSumCount" label="共提现" />
        <el-table-column prop="comSumCount" label="共消耗" />
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchForm = ref({
  date: []
})

const tableData = ref([])
const listLoading = ref(false)
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const initDatas = () => {}
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
</script>

<style lang="scss" scoped>
.statistical-gold {
}
</style>
