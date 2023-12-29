<template>
  <div class="app-container statistical-gold">
    <el-row :gutter="20" class="search-line">
      <el-col :span="6">
        <el-date-picker
          style="width: 100%"
          v-model="searchForm.date"
          type="daterange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD"
        />
        <!-- format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY/MM/DD ddd" -->
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="initDatas">查询</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="summary" label="日期">
          <template #default="scope">
            <img class="list-user-icon" v-if="scope.row.headImg" :src="scope.row.headImg" alt="" />
            <span>
              {{ stampToDate(scope.row.summary) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="goldCount" label="共发行" />
        <el-table-column prop="userCashout" label="共提现" />
        <el-table-column prop="userConsume" label="共消耗" />
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
import { getUserGoldRank } from '@/api/system'
import { formatDateTime } from '@/utils'
const searchForm = ref({
  date: []
})

const stampToDate = (timestamp) => {
  if (!timestamp) return '-'
  return formatDateTime(timestamp)
}

const tableData = ref([])
const listLoading = ref(false)
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const initDatas = () => {
  getUserGoldRank({
    ...pageVO.value,
    ...{
      start: searchForm?.value?.date?.[0],
      end: searchForm?.value?.date?.[1]
    }
  }).then((res) => {
    tableData.value = res.data.records
    total.value = res.data.total
  })
}
initDatas()
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
</script>

<style lang="scss" scoped>
.statistical-gold {
}
</style>
