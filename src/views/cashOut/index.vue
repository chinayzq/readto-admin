<template>
  <div class="app-container cash-out-page">
    <div class="filter-line">
      <el-row :gutter="10">
        <el-col :span="2">
          <el-select @change="initDatas" v-model="searchForm.status" placeholder="状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            style="width: 100%"
            v-model="searchForm.date"
            type="daterange"
            value-format="YYYY-MM-DD"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="initDatas"
          />
        </el-col>
        <el-col :span="4">
          <el-input v-model="searchForm.nickName" placeholder="搜索用户" clearable @input="initDatas" />
        </el-col>
        <el-col :span="2">
          <el-button type="primary" :icon="Search" @click="initDatas">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-table :data="tableData" v-loading="tableLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="image" label="头像">
          <template #default="scope">
            <img class="list-user-icon" v-if="scope.row.headImg" :src="scope.row.headImg" alt="" />
            <img class="list-user-icon" v-else src="@/assets/user/user_default_icon.png" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="nickeName" label="昵称">
          <template #default="scope">
            <span class="link-button" @click="linkButtonClick(scope.row.nickeName)">{{ scope.row.nickeName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单号" />
        <el-table-column prop="money" label="金额" />
        <el-table-column prop="xxx1" label="提现类型" />
        <el-table-column prop="createTime" label="申请时间" width="160">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="160">
          <template #default="scope">
            <span :class="`status-span-${scope.row.status}`">{{ statusMap[scope.row.status] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注说明" show-overflow-tooltip />
        <el-table-column prop="xxx3" label="操作人" />
        <el-table-column prop="operation" label="操作">
          <template #default="scope">
            <el-button type="primary" v-if="scope.row.status === 1" @click="payCheckOpen(scope.row)">审核</el-button>
            <el-button type="primary" v-else link bg size="small" @click="payDetailOpen(scope.row)">详情</el-button>
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
    <PayCheckDialog :dataset="checkDialog" @close="checkDialogClose" />
    <PayDetailDialog :dataset="detailDialog" @close="detailDialogClose" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { formatDateTime } from '@/utils'
import { getPayList } from '@/api/payment'
import PayCheckDialog from './components/payCheckDialog.vue'
import PayDetailDialog from './components/payDetailDialog.vue'

// 1：待审核，2：支付中，3：支付成功，4：支付失败，5：驳回
const statusOptions = ref([
  {
    value: 1,
    label: '待审核'
  },
  {
    value: 2,
    label: '支付中'
  },
  {
    value: 3,
    label: '支付成功'
  },
  {
    value: 4,
    label: '支付失败'
  },
  {
    value: 5,
    label: '驳回'
  }
])
const statusMap = ref({
  1: '待审核',
  2: '支付中',
  3: '支付成功',
  4: '支付失败',
  5: '驳回'
})
const searchForm = ref({
  status: null,
  nickName: null,
  date: []
})
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const tableData = ref([])
const tableLoading = ref(false)
const initDatas = () => {
  tableLoading.value = true
  getPayList({
    ...pageVO.value,
    ...{
      status: searchForm.value.status,
      nickName: searchForm.value.nickName,
      beginTime: searchForm.value?.date?.[0],
      endTime: searchForm.value?.date?.[1]
    }
  })
    .then((res) => {
      tableData.value = res.data.records
      total.value = res.data.total
    })
    .finally(() => {
      tableLoading.value = false
    })
}
initDatas()
const linkButtonClick = (key) => {
  searchForm.value.nickName = key
  initDatas()
}
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}

const checkDialog = ref({
  show: false,
  title: '审核',
  datas: {}
})
const payCheckOpen = (row) => {
  checkDialog.value.datas = row
  checkDialog.value.show = true
}
const checkDialogClose = (fresh) => {
  checkDialog.value.datas = {}
  checkDialog.value.show = false
  if (fresh === true) {
    initDatas()
  }
}

const detailDialog = ref({
  show: false,
  title: '订单详情',
  datas: {}
})
const payDetailOpen = (row) => {
  detailDialog.value.datas = row
  detailDialog.value.show = true
}
const detailDialogClose = () => {
  detailDialog.value.datas = {}
  detailDialog.value.show = false
}
</script>

<style scoped lang="scss">
.cash-out-page {
  .filter-line {
    margin-bottom: 15px;
  }
  .list-user-icon {
    height: 30px;
    width: 30px;
  }
  .link-button {
    color: #409eff;
    cursor: pointer;
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
  .status-span-1 {
    color: blue;
  }
  .status-span-3 {
    color: #2af12a;
  }
  .status-span-5 {
    color: #ff0000;
  }
}
</style>
