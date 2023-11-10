<template>
  <div class="article-dialog-component">
    <el-dialog
      v-model="props.dialogVisible"
      :close-on-click-modal="false"
      :title="props?.dataset?.title"
      width="1000"
      :before-close="handleClose"
    >
      <div class="article-detail" v-loading="dialogLoading">
        <el-form label-position="left" label-width="120px" ref="articleFormIns" :rules="formRules" :model="formData">
          <el-row :gutter="48">
            <el-col :span="24">
              <el-form-item label="文章标题" prop="name">
                <el-input
                  :disabled="currentStatus === 'preview'"
                  placeholder="请输入文章标题"
                  v-model="formData.name"
                />
              </el-form-item>
            </el-col>
            <template v-if="currentStatus !== 'add'">
              <el-col :span="12">
                <el-form-item label="发布时间" prop="publish">
                  {{ formData.publish ? formatDateTime(formData.publish) : "-" }}
                </el-form-item>
              </el-col>
              <el-col :span="12"
                ><el-form-item label="内容字数" prop="totalWords">
                  {{ formData.totalWords || "-" }}
                </el-form-item></el-col
              >
              <el-col :span="12"
                ><el-form-item label="作者" prop="author">
                  {{ formData.author || "-" }}
                </el-form-item></el-col
              >
              <el-col :span="12"
                ><el-form-item label="评论数" prop="comSumCount">
                  {{ formData.comSumCount || 0 }}
                </el-form-item></el-col
              >
              <el-col :span="12"
                ><el-form-item label="点赞数" prop="praise">
                  {{ formData.praise || 0 }}
                </el-form-item></el-col
              >
            </template>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="24">
              <el-form-item label="发布人" prop="userId">
                <el-select
                  :disabled="currentStatus === 'preview'"
                  style="width: 100%"
                  v-model="formData.userId"
                  placeholder="请选择发布人"
                >
                  <el-option v-for="item in userIdOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      </div>
      <div class="button-container">
        <div v-if="currentStatus === 'preview'">
          <el-button type="primary" @click="changeCurrentStatus">编辑</el-button>
        </div>
        <div v-else>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="submitHandler">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css" // 引入 css
import { ref, shallowRef, onBeforeUnmount, watch } from "vue"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
import { getVirtuallyUserList } from "@/api/user"
import { articleUpdate, getArticleDetail } from "@/api/article"
import { getToken } from "@/utils/cache/cookies"
import { ElMessage } from "element-plus"
import { formatDateTime } from "@/utils"

//#region 虚拟用户列表
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
//#endregion

//#region wangEditor config
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
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  setEditorDisableStatus(currentStatus.value === "preview")
}
//#endregion

const emit = defineEmits(["close"])
const handleClose = (flag) => {
  emit("close", flag)
}

//#region 保存、更新
const articleFormIns = ref(null)
const formData = ref({
  name: null,
  content: "",
  userId: null,
  storyType: 1,
  id: null,
  status: 1,
  publish: null,
  totalWords: null,
  author: null,
  comSumCount: null,
  praise: null
})
const formRules = ref({
  name: [
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
      const { name, content, userId, storyType } = formData.value
      const params = { name, content, userId, storyType }
      if (props.dataset.datas.id) {
        params.id = props.dataset.datas.id
      }
      articleUpdate(params).then((res) => {
        if (res.code === 1) {
          ElMessage.success("保存文章成功！")
          handleClose(true)
        }
      })
    }
  })
}
//#endregion

//#region display datas
const dialogLoading = ref(false)
const currentStatus = ref("add")
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
watch(
  () => props.dataset,
  (datas) => {
    console.log("datas", datas)
    currentStatus.value = datas.status
    setEditorDisableStatus(currentStatus.value === "preview")
    if (datas.datas.id) {
      displayArtilceDetail(datas.datas.id)
    } else {
      resetFormData()
    }
  },
  { deep: true }
)
const displayArtilceDetail = (id) => {
  dialogLoading.value = true
  getArticleDetail(id)
    .then((res) => {
      if (res.code === 1) {
        formData.value = { ...formData.value, ...res.data }
      }
    })
    .finally(() => {
      dialogLoading.value = false
    })
}
const resetFormData = () => {
  formData.value = {
    name: null,
    content: "",
    userId: null,
    storyType: 1,
    id: null,
    status: 1,
    publish: null,
    totalWords: null,
    author: null,
    comSumCount: null,
    praise: null
  }
}
const setEditorDisableStatus = (isDisable) => {
  const editor = editorRef.value
  if (!editor) return
  if (isDisable) {
    editor.disable()
  } else {
    editor.enable()
  }
}
const changeCurrentStatus = () => {
  currentStatus.value = "edit"
  setEditorDisableStatus(false)
}
//#endregion
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
