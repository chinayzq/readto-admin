<template>
  <div class="app-container statistical-gold-list">
    <el-row :gutter="20" class="search-line">
      <el-col :span="4">
        <el-select style="width: 100%" v-model="searchForm.duration" placeholder="周期" @change="initDatas">
          <el-option v-for="item in durationOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input style="width: 100%" v-model="searchForm.nickeName" placeholder="昵称" />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="initDatas">查询</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="comSumCount" label="头像" />
        <el-table-column prop="comSumCount" label="昵称" />
        <el-table-column prop="comSumCount" label="总收益" />
        <el-table-column prop="comSumCount" label="总提现" />
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

const durationOptions = ref([
  {
    value: 1,
    label: '今天'
  },
  {
    value: 2,
    label: '周'
  },
  {
    value: 3,
    label: '月'
  },
  {
    value: 4,
    label: '半年'
  },
  {
    value: 5,
    label: '一年'
  },
  {
    value: 6,
    label: '所有'
  }
])
const searchForm = ref({
  duration: [],
  nickeName: null
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
.statistical-gold-list {
}
</style>
