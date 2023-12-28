<template>
  <div class="add-user-dialog">
    <el-dialog
      v-model="props.dialogVisible"
      :close-on-click-modal="false"
      title="新增用户"
      width="800"
      :before-close="handleClose"
    >
      <el-form label-position="right" label-width="80px" ref="userFormIns" :model="formData" :rules="formRules">
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="昵称：" prop="nickName">
              <el-input v-model="formData.nickName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像：" prop="headerImage">
              <el-upload
                class="avatar-uploader"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="formData.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码：" prop="password">
              <el-input type="password" v-model="formData.password" />
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
import { ref } from 'vue'
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default() {
      return false
    }
  },
  dataset: {
    type: Object,
    default() {
      return {}
    }
  }
})

const emit = defineEmits(['close'])
const handleClose = (flag) => {
  emit('close', flag)
}

const formData = ref({
  nickName: null,
  headerImage: null,
  email: null,
  password: null
})
const formRules = ref({
  nickName: [
    {
      required: true,
      message: '请输入昵称!',
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱!',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码!',
      trigger: 'blur'
    }
  ],
  headerImage: [
    {
      required: true,
      message: '请上传头像!',
      trigger: 'blur'
    }
  ]
})
const handleAvatarSuccess = (response, uploadFile) => {
  formData.value.headerImage = URL.createObjectURL(uploadFile.raw)
}
const submitHandler = () => {}
</script>

<style lang="scss" scoped>
.add-user-dialog {
  .button-container {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
<style scoped>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>
