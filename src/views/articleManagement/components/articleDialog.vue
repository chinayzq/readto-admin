<template>
  <div class="article-dialog-component">
    <el-dialog
      v-model="dialogShow"
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
                  {{ formData.publish ? formatDateTime(formData.publish) : '-' }}
                </el-form-item>
              </el-col>
              <el-col :span="12"
                ><el-form-item label="内容字数" prop="totalWords">
                  {{ formData.totalWords || '-' }}
                </el-form-item></el-col
              >
              <el-col :span="12"
                ><el-form-item label="作者" prop="author">
                  {{ formData.author || '-' }}
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
            <el-col :span="24">
              <el-form-item label="文章语言" prop="lang">
                <LangSelector @change="langChange" :default="formData.lang" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="文章标签" prop="tagIds">
                <el-select
                  :disabled="currentStatus === 'preview'"
                  v-model="formData.tagIds"
                  multiple
                  placeholder="Select"
                  multiple-limit="3"
                  style="width: 100%"
                >
                  <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="48">
            <el-col :span="24">
              <el-form-item label="文章详情" prop="content">
                <div class="editor-container" v-if="dialogShow">
                  <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editorRef"
                    :defaultConfig="toolbarConfig"
                    mode="default"
                  />
                  <!-- @customPaste="customPaste" -->
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
          <el-button type="primary" @click="submitHandler" v-loading="submitLoading">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { ref, shallowRef, onBeforeUnmount, watch, computed } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getVirtuallyUserList } from '@/api/user'
import { articleUpdate, getArticleDetail, getAllTagList } from '@/api/article'
import { getToken } from '@/utils/cache/cookies'
import { ElMessage } from 'element-plus'
import { formatDateTime } from '@/utils'
import LangSelector from '@/components/LangSelector/index.vue'
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
  },
  allTagList: {
    type: Array,
    default() {
      return []
    }
  }
})
const customPaste = (editor, event, callback) => {
  console.log('ClipboardEvent 粘贴事件对象', event)
  let html = event.clipboardData.getData('text/html') // 获取粘贴的 html
  // let text = event.clipboardData.getData('text/plain') // 获取粘贴的纯文本
  // const rtf = event.clipboardData.getData('text/rtf') // 获取 rtf 数据（如从 word wsp 复制粘贴）
  if (html) {
    // 列表缩进会超出边框，直接过滤掉
    html = html.replace(/text\-indent:\-(.*?)pt/gi, '')
    editor.dangerouslyInsertHtml(html)

    // 从html内容中查找粘贴内容中是否有图片元素，并返回img标签的属性src值的集合
    const imgSrcs = findAllImgSrcsFromHtml(html)
    console.log('imgSrcs', imgSrcs)
    // // 如果有
    // if (imgSrcs && Array.isArray(imgSrcs) && imgSrcs.length) {
    //   // 从rtf内容中查找图片数据
    //   const rtfImageData = extractImageDataFromRtf(rtf)

    //   // 如果找到
    //   if (rtfImageData.length) {
    //     // TODO：此处可以将图片上传到自己的服务器上

    //     // 执行替换：将html内容中的img标签的src替换成ref中的图片数据，如果上面上传了则为图片路径
    //     html = replaceImagesFileSourceWithInlineRepresentation(html, imgSrcs, rtfImageData)
    //     editor.dangerouslyInsertHtml(html)
    //   }
    // }

    // 阻止默认的粘贴行为
    event.preventDefault()
    return false
  } else {
    return true
  }
}

/**
 * 从html代码中匹配返回图片标签img的属性src的值的集合
 * @param htmlData
 * @return Array
 */
const findAllImgSrcsFromHtml = (htmlData) => {
  const imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src

  const arr = htmlData.match(imgReg) //筛选出所有的img
  if (!arr || (Array.isArray(arr) && !arr.length)) {
    return false
  }

  const srcArr = []
  for (let i = 0; i < arr.length; i++) {
    const src = arr[i].match(srcReg)
    // 获取图片地址
    srcArr.push(src[1])
  }

  return srcArr
}

/** * 从rtf内容中匹配返回图片数据的集合 * @param rtfData * @return Array */
const extractImageDataFromRtf = (rtfData) => {
  if (!rtfData) {
    return []
  }
  const regexPictureHeader = /{\\pict[\s\S]+?({\\\*\\blipuid\s?[\da-fA-F]+)[\s}]*/
  const regexPicture = new RegExp('(?:(' + regexPictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g')
  const images = rtfData.match(regexPicture)
  const result = []
  if (images) {
    for (const image of images) {
      let imageType = false
      if (image.includes('\\pngblip')) {
        imageType = 'image/png'
      } else if (image.includes('\\jpegblip')) {
        imageType = 'image/jpeg'
      }
      if (imageType) {
        result.push({ hex: image.replace(regexPictureHeader, '').replace(/[^\da-fA-F]/g, ''), type: imageType })
      }
    }
  }
  return result
}

/** *
 * 将html内容中img标签的属性值替换 *
 * @param htmlData html内容 *
 * @param imageSrcs html中img的属性src的值的集合 *
 * @param imagesHexSources rtf中图片数据的集合，与html内容中的img标签对应 *
 * @param isBase64Data 是否是Base64的图片数据 *
 *  @return String */
const replaceImagesFileSourceWithInlineRepresentation = (
  htmlData,
  imageSrcs,
  imagesHexSources,
  isBase64Data = true
) => {
  if (imageSrcs.length === imagesHexSources.length) {
    for (let i = 0; i < imageSrcs.length; i++) {
      const newSrc = isBase64Data
        ? `data:${imagesHexSources[i].type};base64,${_convertHexToBase64(imagesHexSources[i].hex)}`
        : imagesHexSources[i]
      htmlData = htmlData.replace(imageSrcs[i], newSrc)
    }
  }
  return htmlData
}
/**
 * 十六进制转base64
 */
const _convertHexToBase64 = (hexString) => {
  return btoa(
    hexString
      .match(/\w{2}/g)
      .map((char) => {
        return String.fromCharCode(parseInt(char, 16))
      })
      .join('')
  )
}

//#region 保存、更新
const langChange = (value) => {
  formData.value.lang = value
  formData.value.tagIds = []
  getTagList()
}
const articleFormIns = ref(null)
const formData = ref({
  name: null,
  content: '',
  userId: null,
  storyType: 1,
  id: null,
  status: 1,
  publish: null,
  totalWords: null,
  author: null,
  comSumCount: null,
  praise: null,
  tagIds: [],
  lang: props.dataset.lang
})
const formRules = ref({
  name: [
    {
      required: true,
      message: '请输入文章标题!',
      trigger: ['blur', 'change']
    }
  ],
  userId: [
    {
      required: true,
      message: '请选择发布人!',
      trigger: ['blur', 'change']
    }
  ],
  tagIds: [
    {
      required: true,
      message: '请选择文章标签(最多3个)!',
      trigger: ['blur', 'change']
    }
  ]
})
const submitLoading = ref(false)
const submitHandler = () => {
  try {
    const contentLength = editorRef.value.getText().length
    console.log('contentLength', editorRef.value.getText())
    if (contentLength < 1000) {
      ElMessage.warning(`当前文章字数：${contentLength}, 长度不能少于1000字符！`)
      return
    }
    if (contentLength > 10000) {
      ElMessage.warning(`当前文章字数：${contentLength}, 长度不能大于10000字符！`)
      return
    }
  } catch (error) {
    console.log('保存文章校验content长度失败：', error)
  }
  articleFormIns.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      const { name, content, userId, storyType, tagIds, lang } = formData.value
      const params = { name, content, userId, storyType, tagIds, lang }
      if (props.dataset.datas.id) {
        params.id = props.dataset.datas.id
      }
      articleUpdate(params)
        .then((res) => {
          if (res.code === 1) {
            ElMessage.success('保存文章成功！')
            handleClose(true)
          }
        })
        .finally(() => {
          submitLoading.value = false
        })
    }
  })
}
//#endregion

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
const tagOptions = ref([])
const tagMaps = ref({})
const getTagList = () => {
  if (!formData.value.lang) return
  getAllTagList({
    page: 1,
    pageSize: 9999,
    lang: formData.value.lang
  }).then((res) => {
    const result = res.data.records.map((item) => {
      tagMaps.value[item.name] = item.id
      return {
        value: item.id,
        label: formData.value.lang === 'zh' ? item.name : getTagZHLabel(item.id, item.name)
      }
    })
    tagOptions.value = result
  })
}
getTagList()
//#endregion

const getTagZHLabel = (tagId, tagName) => {
  const allTagDats = props.allTagList
  if (formData.value.lang === 'zh' || allTagDats?.length === 0) {
    return tagName
  }
  let result = tagName
  allTagDats.forEach((item) => {
    if (item.id === tagId) {
      item.tagExtList.forEach((single) => {
        if (single.lang === 'zh') {
          console.log('single.name', tagName, single.name)
          result = `${tagName} （${single.name}）`
        }
      })
    }
  })
  return result
}

//#region wangEditor config
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      fieldName: 'file',
      server: '/admin/api/story/file/upload',
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
  setEditorDisableStatus(currentStatus.value === 'preview')
}
//#endregion

const emit = defineEmits(['close'])
const handleClose = (flag) => {
  emit('close', flag)
}

//#region display datas
const dialogLoading = ref(false)
const currentStatus = ref('add')
const dialogShow = computed(() => props.dialogVisible)
watch(
  () => props.dataset,
  (datas) => {
    currentStatus.value = datas.status
    setEditorDisableStatus(currentStatus.value === 'preview')
    if (datas.datas.id) {
      displayArtilceDetail(datas.datas.id)
    } else {
      resetFormData(datas.lang)
    }
  },
  { deep: true }
)
const displayArtilceDetail = (id) => {
  dialogLoading.value = true
  getArticleDetail(id)
    .then((res) => {
      if (res.code === 1) {
        res.data.tagIds = res.data.tags ? res.data.tags.split(',').map((item) => tagMaps.value[item]) : []
        formData.value = { ...formData.value, ...res.data }
      }
    })
    .finally(() => {
      getTagList()
      dialogLoading.value = false
    })
}
const resetFormData = (lang) => {
  formData.value = {
    name: null,
    content: '',
    userId: null,
    storyType: 1,
    id: null,
    status: 1,
    publish: null,
    totalWords: null,
    author: null,
    comSumCount: null,
    praise: null,
    lang
  }
  getTagList()
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
  currentStatus.value = 'edit'
  setEditorDisableStatus(false)
}
//#endregion
</script>

<style lang="scss" scoped>
.article-dialog-component {
  .article-detail {
    .editor-container {
      border: 1px solid #dcdfe6;
      width: 100%;
    }
  }
  .button-container {
    margin: 15px 0;
    text-align: right;
  }
}
</style>
