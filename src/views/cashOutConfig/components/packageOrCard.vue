<template>
  <div class="package-or-card">
    <LangSelector @change="langChange" style="margin-bottom: 15px" />
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="level" label="提现档位" />
        <el-table-column prop="rate" :label="moneyNameMap[lang]" />
        <el-table-column prop="limit" label="限制/次" />
        <el-table-column prop="audit" label="是否要审核">
          <template #default="scope">
            <span>
              {{ scope.row.audit === 1 ? '是' : '否' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch
              :before-change="beforeChangeColumn"
              @change="statusChange(scope.row)"
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
import { getRateList, updateRateStatus } from '@/api/payment'
import LangSelector from '@/components/LangSelector/index.vue'
import { ElMessage } from 'element-plus'

const moneyNameMap = ref({
  zh: '人民币',
  en: '美元',
  id: '印尼汇盾',
  ph: '菲律宾比索'
})

const listLoading = ref(false)
const tableData = ref([])
const props = defineProps({
  accountType: {
    type: String,
    default() {
      return 'package'
    }
  }
})

const lang = ref('zh')
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
      accountType: props.accountType,
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
const langChange = (value) => {
  lang.value = value
  initDatas()
}
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}

const statusChange = ({ status, id }) => {
  updateRateStatus({ status, id }).then((res) => {
    if (res.code === 1) {
      ElMessage.success('更新成功！')
      initDatas()
    }
  })
}
</script>

<style lang="scss" scoped>
.package-or-card {
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
}
</style>
