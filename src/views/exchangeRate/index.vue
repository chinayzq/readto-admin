<template>
  <div class="app-container exchange-rate">
    <div class="dollar-rate-line">
      <span class="first-label"> 修改汇率比例 1美元= </span>
      <span>
        <el-input style="display: inline" v-model="dollarGoldMount" />
      </span>
      <span> 金币 </span>
      <el-button type="primary" style="margin-left: 15px" @click="openDialog('USD', dollarGoldMount)">更新</el-button>
      <!-- <el-button>更新日志</el-button> -->
    </div>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="lable" label="币种单位" />
      <el-table-column prop="value" label="美元汇率" />
      <el-table-column prop="updateTime" label="修改时间">
        <template #default="scope">
          <span>
            {{ formatDateTime(scope.row.updateTime) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="primary" link bg size="small" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogDatas.show"
      :close-on-click-modal="false"
      :title="dialogDatas.title"
      width="500"
      :before-close="handleClose"
    >
      <el-form label-position="right" ref="formIns" :model="dialogDatas" :rules="formRules">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="汇率：" prop="amount">
              <el-input v-model="dialogDatas.amount" />
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
import { getUsdRate, setUsdRate, getMoneyChargeRateList, setMoneyChargeRate } from '@/api/payment'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils'

const tableLoading = ref(false)
const tableData = ref([])
const initDatas = () => {
  tableLoading.value = true
  getMoneyChargeRateList()
    .then((res) => {
      tableData.value = res.data
    })
    .finally(() => {
      tableLoading.value = false
    })
}
initDatas()

const dollarGoldMount = ref(0)
const initUsdRate = () => {
  getUsdRate().then((res) => {
    dollarGoldMount.value = res.data
  })
}
initUsdRate()

const dialogDatas = ref({
  show: false,
  title: '',
  amount: 0,
  key: null
})
const typeMap = {
  USD: '金币兑换美元汇率'
}
const formRules = ref({
  amount: [
    {
      required: true,
      message: '请输入汇率!',
      trigger: 'blur'
    }
  ]
})
const currentType = ref('')
const openDialog = (type, amount) => {
  currentType.value = type
  dialogDatas.value.title = typeMap[type]
  dialogDatas.value.amount = amount
  dialogDatas.value.show = true
}
const handleClose = () => {
  dialogDatas.value.show = false
}
const formIns = ref(null)
const submitHandler = () => {
  formIns.value.validate((valid) => {
    if (valid) {
      if (currentType.value === 'USD') {
        setUsdRate({ rate: dialogDatas.value.amount }).then(() => {
          ElMessage.success('更新成功！')
          dialogDatas.value.show = false
          initUsdRate()
        })
      } else {
        setMoneyChargeRate({
          key: dialogDatas.value.key,
          value: dialogDatas.value.amount
        }).then(() => {
          ElMessage.success('更新成功！')
          dialogDatas.value.show = false
          initDatas()
        })
      }
    }
  })
}

const handleEdit = ({ key, lable, value }) => {
  dialogDatas.value.title = lable
  dialogDatas.value.amount = value
  dialogDatas.value.key = key
  dialogDatas.value.show = true
}
</script>

<style scoped lang="scss">
.exchange-rate {
  .dollar-rate-line {
    margin-bottom: 15px;
    font-size: 14px;
  }
  .button-container {
    margin: 15px 0;
    text-align: right;
  }
}
</style>
