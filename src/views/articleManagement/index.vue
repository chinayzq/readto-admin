<template>
  <div class="article-management app-container">
    <div class="search-line">
      <el-row :gutter="20">
        <el-col :span="2">
          <LangSelector @change="langChange" />
        </el-col>
        <el-col :span="2">
          <el-select
            style="width: 100%"
            filterable
            v-model="selectTags"
            placeholder="标签分类"
            clearable
            @change="initDatas"
          >
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.label" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-select v-model="status" placeholder="审核" clearable @change="initDatas">
            <el-option v-for="item in verifyOption" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="keyword" clearable @input="initDatas" placeholder="输入标题/作者搜索文章" />
        </el-col>
        <el-col :span="12">
          <el-button type="primary" :icon="Search" @click="initDatas">查询</el-button>
          <el-button type="primary" :icon="CirclePlus" @click="articleAddOpen">新增文章</el-button>
          <el-button type="primary" :icon="RefreshRight" @click="initDatas">刷新</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="标题">
          <template #default="scope">
            <span class="link-button" @click="articlePreviewOpen(scope.row)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者">
          <template #default="scope">
            <span class="link-button" @click="linkButtonClick(scope.row.author)">{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="comSumCount" label="评论数" width="100" />
        <el-table-column prop="readingUserCount" label="浏览量" width="100" />
        <el-table-column prop="praise" label="点赞" width="100" />
        <el-table-column prop="publish" label="发布时间" width="200">
          <template #default="scope">
            <span>{{ formatDateTime(scope.row.publish) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态">
          <template #default="scope">
            <span>{{ statusMap[scope.row.status] }}</span>
            <span v-if="scope.row.status === 2" class="link-button" @click="openNoPassDetail(scope.row)"> [详情] </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核" width="100">
          <template #default="scope">
            <el-switch
              :before-change="beforeChangeColumn"
              @change="auditStatusChange(scope.row)"
              v-model="scope.row.statusSuccess"
              :active-value="true"
              :inactive-value="false"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link bg size="small" @click="articleEditOpen(scope.row)">编辑</el-button>
            <el-button type="danger" link bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            <!-- <el-button type="primary" link bg size="small" @click="articleEditOpen(scope.row)">刷新</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pageVO.page"
          background
          layout="total, prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <ArticleDialog
      :dialogVisible="dialogVisible"
      :allTagList="allTagList"
      :contentLimit="contentLimit"
      @close="modelCloaseHandler"
      :dataset="dialogData"
    />
    <NoPassDialog :dialogVisible="noPass.show" @close="noPassClose" :articleId="noPass.id" />
  </div>
</template>

<script setup>
import { Search, CirclePlus, RefreshRight } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import ArticleDialog from './components/articleDialog.vue'
import { getArticleList, deleteArticle, updateArticleStatus, getAllTagList, getArticleCatelogList } from '@/api/article'
import { formatDateTime } from '@/utils'
import LangSelector from '@/components/LangSelector/index.vue'
import { getSysConfigList } from '@/api/system'
import NoPassDialog from './components/noPassDialog.vue'

const noPass = ref({
  id: null,
  show: false
})
const openNoPassDetail = ({ id }) => {
  noPass.value.id = id
  noPass.value.show = true
}
const noPassClose = () => {
  noPass.value.show = false
}

const contentLimit = ref({
  min: 1000,
  max: 10000
})
const initContentLimit = () => {
  getSysConfigList().then((res) => {
    res.data.forEach((item) => {
      if (item.key === 'content_min_length') {
        contentLimit.value.min = Number(item.value)
      }
      if (item.key === 'content_max_length') {
        contentLimit.value.max = Number(item.value)
      }
    })
    console.log('contentLimit', contentLimit.value)
  })
}
initContentLimit()

//#region 查询
// status -0:草稿 1: 审核中，2: 审核未通过, 3 审核通过
const statusMap = ref({
  0: '草稿',
  1: '审核中',
  2: '审核未通过',
  3: '审核通过'
})
const keyword = ref(null)
const tableData = ref([])
const status = ref(null)
const listLoading = ref(false)
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const verifyOption = ref([
  {
    label: '全部',
    value: ''
  },
  {
    label: '审核通过',
    value: 3
  },
  {
    label: '审核中',
    value: 1
  },
  {
    label: '审核未通过',
    value: 2
  }
])
const lang = ref('zh')
const allTagList = ref([])
const initDatas = () => {
  listLoading.value = true
  getArticleList({
    ...{
      storyType: 1,
      key: keyword.value,
      status: status.value,
      lang: lang.value,
      tags: selectTags.value,
      orderColumns: ['publish']
    },
    ...pageVO.value
  })
    .then((res) => {
      tableData.value = res.data.records.map((item) => {
        item.statusSuccess = statusHandler(item.status)
        return item
      })
      total.value = res.data.total
    })
    .finally(() => {
      listLoading.value = false
    })
  console.log('allTagList.value', allTagList.value.length)
  if (allTagList.value.length === 0) {
    getArticleCatelogList({ page: 1, pageSize: 999 }).then((res) => {
      allTagList.value = res.data.records
    })
  }
}
const langChange = (value) => {
  lang.value = value
  selectTags.value = null
  initDatas()
  getTagList()
}
const linkButtonClick = (key) => {
  keyword.value = key
  initDatas()
}
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}
const tagOptions = ref([])
const selectTags = ref(null)
const getTagList = () => {
  if (!lang.value) return
  getAllTagList({
    page: 1,
    pageSize: 9999,
    lang: lang.value
  }).then((res) => {
    tagOptions.value = res.data.records.map((item) => {
      return {
        value: item.id,
        label: item.name
      }
    })
  })
}
//#endregion

//#region 删除、修改状态
const handleDelete = ({ id }) => {
  ElMessageBox.confirm('确定删除该文章?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deleteArticle(id).then(() => {
        ElMessage.success('删除成功！')
        initDatas()
      })
    })
    .catch(() => {
      console.log('cancel the delete！')
    })
}
const statusHandler = (status) => {
  return status === 3 ? true : false
}
const switchState = ref(false)
const beforeChangeColumn = () => {
  switchState.value = true
  return switchState.value
}
const auditStatusChange = ({ id, statusSuccess }) => {
  if (!switchState.value) return
  updateArticleStatus({
    status: statusSuccess ? 3 : 2,
    storyId: id
  }).then((res) => {
    if (res.code === 1) {
      ElMessage.success('状态更新成功！')
    }
  })
}
//#endregion

//#region 新增、编辑、预览弹框
const dialogVisible = ref(false)
const dialogData = ref({
  lang: lang.value,
  title: '新增文章',
  status: 'add', // 新增 - add, 预览 - preview, 编辑 - edit
  datas: {}
})
const articleAddOpen = () => {
  dialogData.value.title = '新增文章'
  dialogData.value.status = 'add'
  dialogData.value.datas = {}
  dialogData.value.lang = lang.value
  dialogVisible.value = true
}
const articleEditOpen = (item) => {
  dialogData.value.title = '编辑文章'
  dialogData.value.status = 'edit'
  dialogData.value.lang = lang.value
  dialogData.value.datas = item
  dialogVisible.value = true
}
const articlePreviewOpen = (item) => {
  dialogData.value.title = '文章详情'
  dialogData.value.status = 'preview'
  dialogData.value.datas = item
  dialogVisible.value = true
}
const modelCloaseHandler = (freshFlag) => {
  dialogVisible.value = false
  dialogData.value.datas = {}
  if (freshFlag === true) {
    initDatas()
  }
}
//#endregion
</script>

<style lang="scss" scoped>
.article-management {
  .search-line {
    margin-bottom: 20px;
  }
  .table-container {
    .link-button {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
