<template>
  <div class="ban-dialog">
    <el-dialog
      v-model="dialogShow"
      :close-on-click-modal="false"
      title="新增封禁IP"
      width="600"
      :before-close="handleClose"
    >
      <el-form label-position="right" label-width="120px" ref="banFormIns" :model="formData" :rules="formRules">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="IP地址：" prop="ip">
              <el-input v-model="formData.ip" @blur="ipChange" placeholder="请输入IP地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所在地：" prop="address">
              <el-input :readonly="true" v-model="formData.address" placeholder="输入IP自动显示所在地区" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户数：" prop="userTotal">
              <el-input :readonly="true" v-model="formData.userTotal" placeholder="输入IP自动查询用户数" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="禁止IP新注册：" prop="zh">
              <el-radio-group v-model="formData.status">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-line">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="banSubmit" v-loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { addIpBlocking, getAddressByIp, getUserCountByIp } from '@/api/user'
import { ElMessage } from "element-plus"

const props = defineProps({
  show: {
    type: Boolean,
    default() {
      return false
    }
  }
})

const emit = defineEmits(["close"])
const handleClose = (flag) => {
  clearFormHandler()
  emit("close", flag)
}
const clearFormHandler = () => {
  formData.value = {
    ip: null,
    address: null,
    userTotal: null,
    status: 0
  }
}
const dialogShow = computed(() => props.show)

const ipChange = () => {
  getAddressByIp({ ip:formData.value.ip }).then(res => {
    if (res.code === 1) {
      formData.value.address = res.data
    }
  })
  getUserCountByIp({ ip:formData.value.ip }).then(res => {
    if (res.code === 1) {
      formData.value.userTotal = res.data
    }
  })
}

const formData = ref({
  ip: null,
  address: null,
  userTotal: null,
  status: 0
})
const formRules = ref({
  ip: [
    {
      required: true,
      message: "请输入IP地址!",
      trigger: "blur"
    }
  ]
})
const banFormIns = ref(null)
const submitLoading = ref(false)
const banSubmit = () => {
  banFormIns.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      console.log("params", formData.value)
      addIpBlocking(formData.value).then(res => {
        ElMessage.success("保存成功！")
        submitLoading.value = true
        handleClose(true)
      }).finally(() => {
        submitLoading.value = true
      })
    }
  })
}
</script>

<style scoped lang="scss">
.button-line {
  text-align: right;
}
</style>
