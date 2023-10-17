<template>
  <div class="dictionary-page">
    <div class="button-line">
      <el-button type="primary" @click="addHandler">新增</el-button>
      <el-button type="primary" @click="initTableList">查询</el-button>
    </div>
    <div class="table-container">
      <el-table
        :data="tableData"
        v-loading="pageLoading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="classCode" label="分类编码" />
        <el-table-column prop="className" label="分类名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="operation" label="操作" width="290">
          <template #default="scope">
            <el-button type="primary" text @click="editHandler(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" text @click="deleteHandler(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DictionaryModel
      :dialogVisible="dialogVisible"
      @close="modelCloaseHandler"
      :dataset="dialogData"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import DictionaryModel from "./components/dictionaryModel.vue";
import { getDictionaryList, deleteClassById } from "@/api/dictionary";
const tableData = ref([]);
const pageLoading = ref(false);
const dialogVisible = ref(false);
const dialogData = ref({
  title: "新增分类",
  datas: {},
});
onBeforeMount(() => {
  initTableList();
});
const initTableList = () => {
  pageLoading.value = true;
  getDictionaryList()
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data;
      }
    })
    .finally(() => {
      pageLoading.value = false;
    });
};
const addHandler = () => {
  dialogData.value.title = "新增分类";
  dialogData.value.datas = {};
  dialogVisible.value = true;
};
const editHandler = (row) => {
  dialogData.value.title = "编辑分类";
  dialogData.value.datas = row;
  dialogVisible.value = true;
};
const deleteHandler = ({ classId }) => {
  ElMessageBox.confirm("确定删除该项?", "warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteClassById({ classId }).then((res) => {
        if (res.code === 200) {
          ElMessage({
            message: "删除成功！",
            type: "success",
          });
          initTableList();
        }
      });
    })
    .catch(() => {
      console.log("cancel the delete！");
    });
};
const modelCloaseHandler = (freshFlag) => {
  if (freshFlag === true) initTableList();
  dialogVisible.value = false;
  dialogData.value.datas = {};
};
</script>

<style lang="less" scoped>
.dictionary-page {
  .button-line {
    margin: 10px 0;
  }
  .table-container {
    margin-top: 30px;
  }
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
  :deep(.el-button.is-text) {
    padding: 0 !important;
    margin-right: 15px;
  }
}
</style>