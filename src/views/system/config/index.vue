<template>
  <div class="app-container">
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="lable" label="标题" />
      <el-table-column prop="key" label="key" />
      <el-table-column prop="value" label="value" />
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
      v-model="editDialogShow"
      :close-on-click-modal="false"
      title="修改配置"
      width="600"
      :before-close="handleClose"
    >
      <el-form label-position="right" label-width="120px" ref="formIns" :rules="formRules" :model="formData">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="标题：" prop="lable">
              <span>{{ formData.lable }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="key：" prop="key">
              <el-input disabled placeholder="" v-model="formData.key" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="value：" prop="value">
              <el-input placeholder="" v-model="formData.value" />
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
import { getSysConfigList, sysConfigUpdate } from '@/api/system'
import { formatDateTime } from '@/utils'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const tableLoading = ref(false)
const initDatas = () => {
  tableLoading.value = true
  getSysConfigList()
    .then((res) => {
      console.log(res)
      tableData.value = res.data
    })
    .finally(() => {
      tableLoading.value = false
    })
}
initDatas()

const editDialogShow = ref(false)
const formData = ref({
  label: '',
  key: '',
  value: ''
})
const formRules = ref({
  key: [
    {
      required: true,
      message: '请输入key!',
      trigger: 'blur'
    }
  ],
  value: [
    {
      required: true,
      message: '请输入value!',
      trigger: 'blur'
    }
  ]
})
const handleClose = () => {
  formData.value = {
    label: '',
    key: '',
    value: ''
  }
  editDialogShow.value = false
}
const handleEdit = (row) => {
  formData.value = row
  editDialogShow.value = true
}
const formIns = ref(null)
const submitHandler = () => {
  formIns.value.validate((valid) => {
    if (valid) {
      sysConfigUpdate(formData.value).then((res) => {
        if (res.code === 1) {
          ElMessage.success('修改成功！')
          handleClose(true)
        }
      })
    }
  })
}
</script>

<style>
.button-container {
  margin: 15px 0;
  text-align: right;
}
</style>
