<template>
  <div class="catelog-dialog">
    <el-dialog
      v-model="dialogShow"
      :close-on-click-modal="false"
      :title="props?.dataset?.title"
      width="500"
      :before-close="handleClose"
    >
      <el-form label-position="right" label-width="150px" ref="articleFormIns" :model="formData">
        <el-row :gutter="48">
          <el-col :span="24">
            <el-form-item label="中文名：" prop="zh">
              <el-input v-model="formData.zh" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="English：" prop="en">
              <el-input v-model="formData.en" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Bahasa Indonesia：" prop="id">
              <el-input v-model="formData.id" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-container">
        <div v-if="currentStatus === 'preview'">
          <el-button type="primary" @click="changeCurrentStatus">编辑</el-button>
        </div>
        <div v-else>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitHandler" v-loading="submitLoading">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { updateArticleCatelog } from "@/api/article"
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
  (row) => {
    if (row.datas.id) {
      displayDatas(row.datas)
    } else {
      resetForm()
    }
  },
  { deep: true }
)
const displayDatas = (datas) => {
  sourceDatas.value = datas
  if (datas.tagExtList && datas.tagExtList.length) {
    datas.tagExtList.forEach((item) => {
      formData.value[item.lang] = item.name
    })
  }
}

const formData = ref({
  zh: null,
  en: null,
  id: null
})
const submitLoading = ref(false)
const sourceDatas = ref({})
const submitHandler = () => {
  submitLoading.value = true
  const tagExtList = []
  const id = props?.dataset?.datas?.id || null
  for (const key in formData.value) {
    tagExtList.push({
      id: getItemIdFromSource(key),
      tagId: id,
      lang: key,
      name: formData.value[key]
    })
  }
  const params = {
    id,
    status: 1,
    tagExtList
  }
  updateArticleCatelog(params)
    .then((res) => {
      if (res.code === 1) {
        ElMessage.success("保存成功！")
        handleClose(true)
      }
    })
    .finally(() => {
      submitLoading.value = false
    })
}

const getItemIdFromSource = (key) => {
  if (sourceDatas.value.tagExtList && sourceDatas.value.tagExtList.length) {
    for (let i = 0; i < sourceDatas.value.tagExtList.length; i++) {
      if (key === sourceDatas.value.tagExtList[i].lang) {
        return sourceDatas.value.tagExtList[i].id
      }
    }
    return null
  }
}

const emit = defineEmits(["close"])
const handleClose = (flag) => {
  resetForm()
  emit("close", flag)
}
const resetForm = () => {
  formData.value = {
    zh: null,
    en: null,
    id: null
  }
}
</script>

<style lang="scss" scoped>
.catelog-dialog {
  .button-container {
    margin-top: 15px;
    text-align: right;
  }
}
</style>
