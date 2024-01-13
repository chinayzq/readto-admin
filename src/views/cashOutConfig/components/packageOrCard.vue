<template>
  <div class="package-or-card">
    <el-row>
      <el-col :span="4">
        <LangSelector @change="langChange" style="margin-bottom: 15px" />
      </el-col>
    </el-row>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="level" label="提现档位" />
        <el-table-column prop="rate" :label="moneyNameMap[lang]" />
        <el-table-column prop="limit" label="限制/次">
          <template #default="scope">
            {{ limitMaps[scope.row.limit] }}
          </template>
        </el-table-column>
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
      <el-form label-position="right" label-width="120px" ref="articleFormIns" :model="formData">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="金币数：" prop="level">
              <el-input placeholder="" v-model="formData.level" @input="goldCountChange" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="`${moneyNameMap[lang]}：`" prop="rate">
              <!-- 当前钱= 金币数/100w * 当前币种美元汇率 -->
              <!-- <span>
                {{ (formData.level / usdRate) * rateMaps[lang] }}
              </span> -->
              <el-input placeholder="" v-model="formData.rate" />
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
import { getRateList, updateRateStatus, rateSaveOrUpdate } from '@/api/payment'
import LangSelector from '@/components/LangSelector/index.vue'
import { getUsdRate, getMoneyChargeRateList } from '@/api/payment'
import { ElMessage } from 'element-plus'

const limitOptions = ref([
  {
    value: '0-1',
    label: '1次'
  },
  {
    value: '0-2',
    label: '2次'
  },
  {
    value: '0-3',
    label: '3次'
  },
  {
    value: '0-0',
    label: '不限制'
  }
])
const limitMaps = ref({
  '0-1': '1次',
  '0-2': '2次',
  '0-3': '3次',
  '0-0': '不限'
})
const limitValueMaps = ref({
  '0-1': 1,
  '0-2': 2,
  '0-3': 3,
  '0-0': 0
})
const moneyNameMap = ref({
  zh: '人民币',
  en: '美元',
  id: '印尼汇盾',
  ph: '菲律宾比索'
})
const rateMaps = ref({
  zh: 0,
  en: 0,
  id: 0,
  ph: 0,
  sg: 0
})
// 当前美元汇率
getUsdRate().then((res) => {
  rateMaps.value.en = Number(res.data)
})
getMoneyChargeRateList().then((res) => {
  res.data.forEach((item) => {
    // 印尼
    if (item.key === 'id_usd_rate') {
      rateMaps.value.id = Number(item.value)
    }
    // 菲律宾
    if (item.key === 'ph_usd_rate') {
      rateMaps.value.ph = Number(item.value)
    }
    // 新加坡
    if (item.key === 'sg_usd_rate') {
      rateMaps.value.sg = Number(item.value)
    }
  })
})

const goldCountChange = (count) => {
  debugger
  if (rateMaps.value[lang.value] !== 0) {
    formData.value.rate = (count / rateMaps.value[lang.value]).toFixed(2)
  }
}

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

const switchState = ref(false)
const beforeChangeColumn = () => {
  switchState.value = true
  return switchState.value
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
  rate: '',
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
      accountType: Number(props.accountType),
      limit: limitValueMaps.value[formData.value.limit]
    }
  }
  console.log('params', params)
  params.rate = Number(params.rate)
  rateSaveOrUpdate(params).then((res) => {
    if (res.code === 1) {
      ElMessage.success('更新成功！')
      handleClose()
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
  .button-container {
    margin: 15px 0;
    text-align: right;
  }
}
</style>
