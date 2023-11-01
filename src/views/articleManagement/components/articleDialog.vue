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
        <template v-if="props.dataset.datas.id">
          <!-- 编辑 -->
          111
        </template>
        <template v-else>
          <!-- 新增 -->
          <el-form label-position="left" label-width="120px" ref="articleFormIns" :rules="formRules" :model="formData">
            <el-row :gutter="48">
              <el-col :span="24">
                <el-form-item label="文章标题" prop="title">
                  <el-input placeholder="请输入文章标题" v-model="formData.title" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="24">
                <el-form-item label="发布人" prop="userId">
                  <el-select style="width: 100%" v-model="formData.userId" placeholder="Select">
                    <el-option
                      v-for="item in userIdOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="48">
              <el-col :span="24">
                <el-form-item label="文章详情" prop="content">
                  <div class="editor-container">
                    <Toolbar
                      style="border-bottom: 1px solid #ccc"
                      :editor="editorRef"
                      :defaultConfig="toolbarConfig"
                      mode="default"
                    />
                    <Editor
                      style="height: 500px; width: 100%; overflow-y: hidden"
                      v-model="formData.content"
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
      <div class="button-container">
        <el-button>取消</el-button>
        <el-button type="primary" @click="submitHandler">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css" // 引入 css
import { ref, onMounted, shallowRef, onBeforeUnmount } from "vue"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import { getVirtuallyUserList } from "@/api/user"
import { articleUpdate } from "@/api/article"
import { getToken } from "@/utils/cache/cookies"
import { ElMessage } from "element-plus"
const userIdOptions = ref([])
const getVirtuaUserList = () => {
  getVirtuallyUserList().then((res) => {
    if (res.data && res.data.length) {
      userIdOptions.value = res.data.map((item) => {
        return {
          value: item.userId,
          label: item.name
        }
      })
    }
  })
}
getVirtuaUserList()

const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      fieldName: "file",
      server: "/admin/api/story/file/upload",
      headers: {
        Authorization: getToken()
      },
      customInsert(res, insertFn) {
        // 从 res 中找到 url，然后插入图片
        insertFn(res.data.url)
      }
    }
  }
}
onMounted(() => {
  setTimeout(() => {
    formData.value.content = "<p style='color: red'>oho~</p>"
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

const articleFormIns = ref(null)
const formData = ref({
  title: null,
  content: "<p>hello</p>",
  userId: null,
  storyType: 1,
  id: null,
  status: 1
})
const formRules = ref({
  title: [
    {
      required: true,
      message: "请输入文章标题!",
      trigger: "blur"
    }
  ],
  userId: [
    {
      required: true,
      message: "请选择发布人!",
      trigger: "blur"
    }
  ]
})
const submitHandler = () => {
  articleFormIns.value.validate((valid) => {
    if (valid) {
      console.log("formData", formData.value)
      articleUpdate(formData.value).then((res) => {
        if (res.code === 1) {
          ElMessage.success("保存文章成功！")
          handleClose(true)
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.article-dialog-component {
  .article-detail {
    .editor-container {
      border: 1px solid #dcdfe6;
    }
  }
  .button-container {
    margin: 15px 0;
    text-align: right;
  }
}
</style>
