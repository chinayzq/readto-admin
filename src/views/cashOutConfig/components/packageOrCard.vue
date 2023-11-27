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
            <el-button type="primary" link bg size="small" @click="handleEdit(scope.row)">修改</el-button>
            <!-- <el-button type="danger" link bg size="small" @click="handleDelete(scope.row)">删除</el-button> -->
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
    <el-dialog
      v-model="editDialogShow"
      :close-on-click-modal="false"
      title="修改提现挡位"
      width="600"
      :before-close="handleClose"
    >
      <el-form label-position="right" label-width="120px" ref="articleFormIns" :rules="formRules" :model="formData">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="金币数：" prop="level">
              <el-input placeholder="" v-model="formData.level" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="`${moneyNameMap[lang]}：`" prop="rate">
              <span>
                <!-- 当前钱= 金币数/100w * 当前币种美元汇率 -->
                {{ (formData.level / usdRate) * rateMaps[lang] }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="限制：" prop="limit">
              <el-select style="width: 100%" v-model="formData.limit" placeholder="">
                <el-option v-for="item in limitOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否要审核：" prop="audit">
              <el-switch v-model="formData.audit" :active-value="1" :inactive-value="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-container">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitHandler">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getRateList, updateRateStatus } from '@/api/payment'
import LangSelector from '@/components/LangSelector/index.vue'
import { getUsdRate, getMoneyChargeRateList } from '@/api/payment'
import { ElMessage } from 'element-plus'

const limitOptions = ref([
  {
    value: 1,
    label: '1次'
  },
  {
    value: 2,
    label: '2次'
  },
  {
    value: 3,
    label: '3次'
  },
  {
    value: 0,
    label: '不限制'
  }
])
const moneyNameMap = ref({
  zh: '人民币',
  en: '美元',
  id: '印尼汇盾',
  ph: '菲律宾比索'
})
const rateMaps = ref({
  zh: 10,
  en: 10,
  id: 10,
  ph: 10
})
// 当前美元汇率
// const usdRate = ref(1000000)
// getUsdRate().then((res) => {
//   usdRate.value = Number(res.data)
// })
// 各币种对美元汇率
// const rateKeyMaps = ref({
//   zh: 'zh_usd_rate',
//   zh: 'zh_usd_rate',
//   zh: 'zh_usd_rate',
//   zh: 'zh_usd_rate',
// })
// getMoneyChargeRateList().then(res => {
//   res.data.forEach(item => {

//   })
// })

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

const editDialogShow = ref(false)
const formData = ref({
  level: '',
  limit: '',
  audit: 1,
  id: ''
})
const handleEdit = (row) => {
  formData.value = { ...formData.value, ...row }
  editDialogShow.value = true
}
const handleClose = () => {
  formData.value = { level: '', limit: '', audit: 1, id: '' }
  editDialogShow.value = false
}
const submitHandler = () => {
  const params = {
    ...formData.value,
    ...{
      lang: lang.value,
      accountType: props.accountType
    }
  }
  console.log('params', params)
}
</script>

<style lang="scss" scoped>
.package-or-card {
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
  .button-container {
    margin: 15px 0;
    text-align: right;
  }
}
</style>
