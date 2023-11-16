<template>
  <div class="config-edit-dialog">
    <el-dialog v-model="dialogShow" :close-on-click-modal="false" title="编辑" width="600" :before-close="handleClose">
      <el-form label-position="right" label-width="120px" ref="taskFormIns" :rules="formRules" :model="formData">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="内容：" prop="name">
              <el-input placeholder="请输内容" v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述：" prop="des">
              <el-input placeholder="请输描述" v-model="formData.des" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="奖励金币：" prop="amount">
              <el-input placeholder="请输奖励金币" v-model="formData.amount" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-container">
        <div>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitHandler">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { updateTask } from '@/api/task'
import { ElMessage } from "element-plus"
const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {}
    }
  }
})
const dialogShow = computed(() => props.dataset.show)
watch(
  () => props.dataset,
  (datas) => {
    if (datas) {
      formData.value = datas.datas
    }
  },
  { deep: true }
)

const emit = defineEmits(["close"])
const handleClose = (flag) => {
  emit("close", flag)
}

const formData = ref({
  name: null,
  des: null,
  amount: null
})
const formRules = ref({
  name: [
    {
      required: true,
      message: "请输内容!",
      trigger: "blur"
    }
  ],
  amount: [
    {
      required: true,
      message: "请输奖励金币!",
      trigger: "blur"
    }
  ]
})

const taskFormIns = ref(null)
const submitHandler = () => {
  taskFormIns.value.validate((valid) => {
    if (valid) {
      const { amount, name, des } = formData.value
      const { id, taskId } = props.dataset.datas
      updateTask({
        amount, name, des, id, taskId 
      }).then(res => {
        if(res.code === 1) {
          ElMessage.success("保存成功！")
          handleClose(true)
        }
      })
      
    }
  })
}
</script>

<style lang="scss" scoped>
.config-edit-dialog {
  .button-container {
    text-align: right;
    margin-top: 15px;
  }
}
</style>
