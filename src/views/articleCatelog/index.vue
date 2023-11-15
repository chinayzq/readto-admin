<template>
  <div class="article-cartelog-component app-container">
    <div class="serach-line">
      <el-button type="primary" :icon="CirclePlus" @click="catelogAdd">新增分类</el-button>
    </div>
    <div class="table-container">
      <el-table :data="tableData" v-loading="listLoading">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="Chinese" label="中文">
          <template #default="scope">
            <span>
              {{ getCatelogDetail(scope.row, "zh") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="English" label="English">
          <template #default="scope">
            <span>
              {{ getCatelogDetail(scope.row, "en") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="Indonesia" label="Bahasa Indonesia">
          <template #default="scope">
            <span>
              {{ getCatelogDetail(scope.row, "id") }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="显示/隐藏">
          <template #default="scope">
            <el-switch
              @change="auditStatusChange(scope.row)"
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" link bg size="small" @click="configEditOpen(scope.row)">修改</el-button>
            <el-button type="danger" link bg size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pageVO.page"
        background
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
    <CatelogDialog :dataset="dialogDatas" @close="dialogClose" />
  </div>
</template>

<script setup>
import { CirclePlus } from "@element-plus/icons-vue"
import { ref } from "vue"
import CatelogDialog from "./components/catelogDialog.vue"
import { getArticleCatelogList, updateArticleCatelogStatus, deleteArticleCatelog } from "@/api/article"
import { ElMessage, ElMessageBox } from "element-plus"
const pageVO = ref({
  page: 1,
  pageSize: 10
})
const total = ref(0)
const listLoading = ref(false)
const tableData = ref([])
const initDatas = () => {
  listLoading.value = true
  getArticleCatelogList(pageVO.value)
    .then((res) => {
      console.log(res)
      tableData.value = res.data.records
      total.value = res.data.total
    })
    .finally(() => {
      listLoading.value = false
    })
}
initDatas()
const handleCurrentChange = (page) => {
  pageVO.value.page = page
  initDatas()
}

const auditStatusChange = ({ status, id }) => {
  updateArticleCatelogStatus({
    status,
    id
  }).then((res) => {
    if (res.code === 1) {
      ElMessage.success("保存成功！")
      initDatas()
    }
  })
}

const dialogDatas = ref({
  show: false,
  title: "新增分类",
  datas: {}
})
const catelogAdd = () => {
  dialogDatas.value.datas = {}
  dialogDatas.value.title = "新增分类"
  dialogDatas.value.show = true
}
const configEditOpen = (row) => {
  dialogDatas.value.datas = row
  dialogDatas.value.title = "编辑分类"
  dialogDatas.value.show = true
}
const handleDelete = ({ id }) => {
  ElMessageBox.confirm("确定删除该分类?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteArticleCatelog(id).then(() => {
        ElMessage.success("删除成功！")
        initDatas()
      })
    })
    .catch(() => {
      console.log("cancel the delete！")
    })
}
const dialogClose = (fresh) => {
  dialogDatas.value.show = false
  if (fresh === true) {
    initDatas()
  }
}

const getCatelogDetail = (list, type) => {
  if (list && list.tagExtList && list.tagExtList.length) {
    for (let i = 0; i < list.tagExtList.length; i++) {
      if (list.tagExtList[i].lang === type) {
        return list.tagExtList[i].name
      }
    }
    return "-"
  }
  return "-"
}
</script>

<style lang="scss" scoped>
.article-cartelog-component {
  .serach-line {
    margin-bottom: 20px;
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }
}
</style>
