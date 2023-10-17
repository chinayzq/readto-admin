<template>
  <div class="template-list-page">
    <div class="filter-line">
      <el-button type="primary" @click="addNewTemplate">新模板</el-button>
    </div>
    <div class="table-container">
      <el-table
        height="530"
        :data="tableData"
        v-loading="pageLoading"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="itemCode" label="模板分类名称" />
        <el-table-column prop="extend1" label="描述" />
        <el-table-column prop="operation" label="操作">
          <template #default="scope">
            <el-button type="primary" text @click="addHandler(scope.row)">
              添加模板
            </el-button>
            <el-button type="primary" text @click="editHandler(scope.row)">
              模板列表
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <TemplateListDialog
      :dataset="templateDialogDatas"
      @close="dialogCloseHandler"
    />
  </div>
</template>

<script setup name="template-list-page">
import { useRouter } from "vue-router";
import { getItemByClassId } from "@/api/dictionary";
import { onBeforeMount, ref } from "vue";
import TemplateListDialog from "./components/TemplateListDialog.vue";
const router = useRouter();

onBeforeMount(() => {
  getTableList();
});

const pageLoading = ref(false);
const tableData = ref([]);
const getTableList = () => {
  pageLoading.value = true;
  getItemByClassId({
    classId: "19",
  })
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data;
      }
    })
    .finally(() => {
      pageLoading.value = false;
    });
};

const templateDialogDatas = ref({
  show: false,
  title: "模板列表",
  typeCode: null,
});
const editHandler = ({ itemCode }) => {
  templateDialogDatas.value.show = true;
  templateDialogDatas.value.typeCode = itemCode;
};
const dialogCloseHandler = (freshFlag) => {
  if (freshFlag === true) getTableDatas();
  templateDialogDatas.value.show = false;
  templateDialogDatas.value.typeCode = "";
};

const addHandler = ({ itemCode }) => {
  router.push({
    path: "/template/detail",
    query: {
      typeCode: itemCode,
    },
  });
};
const addNewTemplate = () => {
  router.push({
    path: "/template/detail",
  });
};
</script>

<style lang="less" scoped>
.template-list-page {
  .filter-line {
    margin-bottom: 20px;
  }
  :deep(.el-button.is-text) {
    padding: 0 !important;
    margin-right: 15px;
  }
}
</style>