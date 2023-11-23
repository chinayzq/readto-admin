<template>
  <div class="phone-charge-page">
    <LangSelector @change="langChange" style="margin-bottom: 15px" />
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="level" label="充值档位" />
        <el-table-column prop="amount" label="扣除金币" />
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
import { ref } from 'vue'
import { getRateList } from '@/api/payment'
import LangSelector from '@/components/LangSelector/index.vue'

const tableData = ref([])
const lang = ref('zh')
const listLoading = ref(false)
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const initDatas = () => {
  listLoading.value = true
  getRateList({
    ...{
      lang: lang.value,
      accountType: 3,
      orderColumns: 'level',
      isDes: true
    },
    ...pageVO.value
  })
    .then((res) => {
      console.log(res)
      if (res.code === 1) {
        tableData.value = res.data.records
        total.value = res.data.total
      }
    })
    .finally(() => {
      listLoading.value = false
    })
}
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
const langChange = (value) => {
  lang.value = value
  initDatas()
}
</script>

<style lang="scss" scoped>
.phone-charge-page {
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
}
</style>
