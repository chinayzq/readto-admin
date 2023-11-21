<template>
  <div class="pay-check-dialog">
    <el-dialog
      v-model="dialogShow"
      :close-on-click-modal="false"
      :title="props?.dataset?.title"
      width="600"
      :before-close="handleClose"
    >
      <el-form label-position="right" ref="formIns" :model="formData">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="通过：" prop="status">
              <el-switch v-model="formData.status" :active-value="3" :inactive-value="5" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="memo">
              <el-input style="width: 100%" v-model="formData.memo" :rows="2" type="textarea" placeholder="备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-container">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submitHandler" v-loading="submitLoading">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { payCheck } from '@/api/payment'
import { ElMessage } from 'element-plus'
const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {}
    }
  }
})
const dialogShow = computed(() => props.dataset.show)

const emit = defineEmits(['close'])
const handleClose = (flag) => {
  emit('close', flag)
}

const formData = ref({
  status: 3,
  memo: null
})
const submitLoading = ref(false)
const submitHandler = () => {
  payCheck({
    ...formData.value,
    ...{
      goldIds: props?.dataset?.datas?.goldId
    }
  })
    .then((res) => {
      if (res.code === 1) {
        ElMessage.success('保存成功！')
        handleClose(true)
      }
    })
    .finally(() => {
      submitLoading.value = false
    })
}
</script>

<style lang="scss" scoped>
.pay-check-dialog {
  .button-container {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
