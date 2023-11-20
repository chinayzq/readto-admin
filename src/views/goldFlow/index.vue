<template>
  <div class="app-container gold-flow-page">
    <div class="filter-line">
      <el-row :gutter="10">
        <el-col :span="2">
          <el-select @change="initDatas" v-model="searchForm.calcType" placeholder="类型" clearable>
            <el-option v-for="item in calcTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select @change="initDatas" v-model="searchForm.taskType" placeholder="事件原因" clearable>
            <el-option v-for="item in taskTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            style="width: 100%"
            v-model="searchForm.date"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-col>
        <el-col :span="4">
          <el-input v-model="searchForm.key" placeholder="搜索用户" />
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
        <el-table-column prop="nickeName" label="昵称" />
        <el-table-column prop="calcType" label="属性">
          <template #default="scope">
            <span>{{ calcTypeMaps[scope.row.calcType] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="变动">
          <template #default="scope">
            <span
              :style="{
                color: scope.row.calcType === 1 ? 'orange' : 'black'
              }"
              >{{ scope.row.calcType === 1 ? `+${scope.row.amount}` : `-${scope.row.amount}` }}</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="taskType" label="事件原因">
          <template #default="scope">
            <span>{{ taskTypeMaps[scope.row.taskType] || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="申请时间" width="160">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.updateTime) }}</span>
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
import { Search } from '@element-plus/icons-vue'
import { getGoldFlowList } from '@/api/payment'
import { formatDateTime } from '@/utils'

const calcTypeOptions = ref([
  {
    value: 1,
    label: '增加'
  },
  {
    value: 2,
    label: '减少'
  }
])
// 任务大类 1：签到，2：基本，3：日常
const taskTypeOptions = ref([
  {
    value: 1,
    label: '签到'
  },
  {
    value: 2,
    label: '基本'
  },
  {
    value: 3,
    label: '日常'
  }
])
const calcTypeMaps = ref({
  1: '增加',
  2: '减少'
})
const taskTypeMaps = ref({
  1: '签到',
  2: '基本',
  3: '日常'
})
const searchForm = ref({
  calcType: null,
  taskType: null,
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
  getGoldFlowList(pageVO.value)
    .then((res) => {
      tableData.value = res.data.records
      total.value = res.data.total
    })
    .finally(() => {
      tableLoading.value = false
    })
}
initDatas()
</script>

<style scoped lang="scss">
.gold-flow-page {
  .filter-line {
    margin-bottom: 15px;
  }
  .list-user-icon {
    height: 30px;
    width: 30px;
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
}
</style>
