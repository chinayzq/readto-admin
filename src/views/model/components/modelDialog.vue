<template>
  <div class="model-dialog-component">
    <el-dialog
      v-model="props.dataset.show"
      :title="props.dataset.title"
      width="800"
      :before-close="handleClose"
    >
      <el-upload
        v-model:file-list="fileList"
        :action="beseUploadUrl"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <div class="button-container">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="saveHandler">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="previewDialog.show">
      <img w-full :src="previewDialog.url" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { Plus } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { createPhoneColor, getPhoneColor } from "@/api/model";
import { ElMessage } from "element-plus";
import config from "~/config";
import { buildImageUrl } from "@/utils/index.js";
const beseUploadUrl = config[import.meta.env.MODE].uploadUrl;
const emit = defineEmits();
const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});
const previewDialog = ref({
  show: false,
  url: "",
});
const fileList = ref([]);

watch(
  props.dataset,
  (datas) => {
    initAndDisplayDatas(datas);
  },
  { deep: true }
);
const initAndDisplayDatas = (datas) => {
  if (!datas.type) return;
  const { type, phoneCode } = datas;
  getPhoneColor({ type, phoneCode }).then((res) => {
    if (res.code === 200) {
      fileList.value = res.data[0].colorUrlList;
    }
  });
};
const handleClose = (flag) => {
  fileList.value = [];
  emit("close", flag);
};
const handlePictureCardPreview = (uploadFile) => {
  previewDialog.value.url = uploadFile;
  previewDialog.value.show = true;
};
const saveHandler = () => {
  const params = {
    type: props.dataset.type,
    phoneCode: props.dataset.phoneCode,
    colorUrlList: fileList.value.map((item) => {
      return {
        colorName: item.colorName || item.name,
        url: buildImageUrl(item.response ? item.response.data : item.url),
      };
    }),
  };
  createPhoneColor(params).then((res) => {
    if (res.code === 200) {
      ElMessage({
        message: "保存成功!",
        type: "success",
      });
      handleClose(true);
    }
  });
};
</script>

<style lang="less" scoped>
.model-dialog-component {
  .button-container {
    margin-top: 10px;
    text-align: right;
  }
}
</style>