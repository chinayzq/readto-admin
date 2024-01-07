<template>
  <div class="app-container statistical-activation">
    <el-row :gutter="20" class="search-line">
      <el-col :span="4">
        <el-input style="width: 100%" v-model="searchForm.name" placeholder="昵称" />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="initDatas">查询</el-button>
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="headImg" label="头像">
          <template #default="scope">
            <img class="list-user-icon" v-if="scope.row.headImg" :src="scope.row.headImg" alt="" />
            <img class="list-user-icon" v-else src="@/assets/user/user_default_icon.png" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="nickeName" label="昵称" />
        <el-table-column prop="day" label="登录天数" />
        <el-table-column prop="firstLike" label="文章点赞数" />
        <el-table-column prop="secondLike" label="文章评论点赞数" />
        <el-table-column prop="commentTotal" label="文章评论数" />
        <el-table-column prop="friendsLikeTotal" label="交友点赞数" />
        <el-table-column prop="friendsCommentLikeTotal" label="交友评论点赞数">
          <template #default="scope">
            <span>
              {{ scope.row.friendsCommentLikeTotal || 0 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="friendsCommentTotal" label="交友评论数" />
        <el-table-column prop="shardTotal" label="分享" />
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
  name: null
})

const tableData = ref([])
const listLoading = ref(false)
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const initDatas = () => {
  getLiveUserList({
    ...pageVO.value,
    ...{
      // name: searchForm.value.name ? encodeURI(searchForm.value.name) : ''
      name: 'Anjing%20liar%20tersebar'
      // name: searchForm.value.name || ''
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
.statistical-activation {
  .list-user-icon {
    height: 30px;
    width: 30px;
  }
}
</style>
