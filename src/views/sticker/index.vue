<template>
  <div class="sticker-page-component">
    <div class="filter-line">
      <el-button type="primary" @click="addNewSticker">新增贴纸分类</el-button>
      <el-button type="primary" @click="getTableDatas">查询</el-button>
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
        <el-table-column prop="stickerName" label="贴纸分类名称" />
        <el-table-column prop="stickerUrl" label="封面照片">
          <template #default="scope">
            <img
              v-lazy="scope.row.stickerUrl"
              class="table-sticker-image"
              alt=""
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="operation" label="操作">
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
    <StickerDialog :dataset="stickerDialogDatas" @close="dialogCloseHandler" />
  </div>
</template>

<script setup>
import { getStickerList, deletePhoneSticker } from "@/api/sticker";
import { onBeforeMount, ref } from "vue";
import StickerDialog from "./components/stickerDialog.vue";
import { ElMessageBox, ElMessage } from "element-plus";
const pageLoading = ref(false);
const tableData = ref([]);
const stickerDialogDatas = ref({
  show: false,
  title: "新贴纸",
  datas: {},
});
onBeforeMount(() => {
  getTableDatas();
});
const getTableDatas = () => {
  pageLoading.value = true;
  getStickerList()
    .then((res) => {
      tableData.value = res.data;
    })
    .finally(() => {
      pageLoading.value = false;
    });
};
const dialogCloseHandler = (freshFlag) => {
  if (freshFlag === true) getTableDatas();
  stickerDialogDatas.value.show = false;
  stickerDialogDatas.value.datas = {};
};
const addNewSticker = () => {
  stickerDialogDatas.value.title = "新贴纸";
  stickerDialogDatas.value.show = true;
};
const editHandler = (row) => {
  stickerDialogDatas.value.title = "编辑贴纸";
  stickerDialogDatas.value.datas = row;
  stickerDialogDatas.value.show = true;
};
const deleteHandler = ({ id }) => {
  ElMessageBox.confirm("确定删除该条数据吗?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePhoneSticker({ id }).then((res) => {
        if (res.code === 200) {
          ElMessage({
            message: "删除成功！",
            type: "success",
          });
          getTableDatas();
        }
      });
    })
    .catch(() => {
      console.log("取消删除！");
    });
};
</script>

<style lang="less" scoped>
.sticker-page-component {
  .filter-line {
    margin-bottom: 20px;
  }
  .table-sticker-image {
    height: 50px;
    width: 50px;
  }
  :deep(.el-button.is-text) {
    padding: 0 !important;
    margin-right: 15px;
  }
}
</style>