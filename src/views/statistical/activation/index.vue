<template>
  <div class="app-container statistical-activation">
    <el-row :gutter="20" class="search-line">
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
        <el-table-column prop="comSumCount" label="登录天数" />
        <el-table-column prop="comSumCount" label="文章点赞数" />
        <el-table-column prop="comSumCount" label="文章评论点赞数" />
        <el-table-column prop="comSumCount" label="文章评论数" />
        <el-table-column prop="comSumCount" label="交友点赞数" />
        <el-table-column prop="comSumCount" label="交友评论点赞数" />
        <el-table-column prop="comSumCount" label="交友评论数" />
        <el-table-column prop="comSumCount" label="分享" />
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
import { getLiveUserList } from '@/api/user'
const searchForm = ref({
  nickeName: null
})

const tableData = ref([])
const listLoading = ref(false)
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const initDatas = () => {
  getLiveUserList(pageVO.value).then((res) => {
    console.log('getLiveUserList', res)
  })
}
initDatas()
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
</script>

<style lang="scss" scoped>
.statistical-activation {
}
</style>
