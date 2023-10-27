<template>
  <div class="article-dialog-component">
    <el-dialog
      v-model="props.dialogVisible"
      :close-on-click-modal="false"
      :title="props?.dataset?.title"
      width="1000"
      :before-close="handleClose"
    >
      <div class="article-detail">
        <template v-if="props.dataset.datas.articleId">
          <!-- 编辑 -->
        </template>
        <template v-else>
          <!-- 新增 -->
          <el-form label-position="left" label-width="120px" ref="couponFormIns" :rules="formRules" :model="formData">
            <el-row :gutter="48">
              <el-col :span="24">
                <el-form-item label="文章标题" prop="articleTitle">
                  <el-input placeholder="请输入文章标题" v-model="formData.articleTitle" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="24">
                <el-form-item label="文章标题" prop="valueHtml">
                  <div class="editor-container">
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editorRef"
                      :defaultConfig="toolbarConfig"
                      mode="default"
                    />
                    <Editor
                      style="height: 500px; width: 100%; overflow-y: hidden"
                      v-model="formData.valueHtml"
                      :defaultConfig="editorConfig"
                      mode="default"
                      @onCreated="handleCreated"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css" // 引入 css
import { ref, onMounted, shallowRef, onBeforeUnmount } from "vue"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = { placeholder: "请输入内容..." }
onMounted(() => {
  setTimeout(() => {
    formData.value.valueHtml = "<p style='color: red'>oho~</p>"
  }, 1500)
})
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const emit = defineEmits(["close"])
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

const handleClose = (flag) => {
  emit("close", flag)
}

const couponFormIns = ref(null)
const formData = ref({
  articleTitle: null,
  valueHtml: "<p>hello</p>"
})
const formRules = ref({
  articleTitle: [
    {
      required: true,
      message: "请输入文章标题!",
      trigger: "blur"
    }
  ]
})
</script>

<style lang="scss" scoped>
.article-dialog-component {
  .article-detail {
    .editor-container {
      border: 1px solid #dcdfe6;
    }
  }
}
</style>
