<template>
  <div class="sticker-dialog-component">
    <el-dialog
      v-model="props.dataset.show"
      :title="props.dataset.title"
      width="800"
      top="65px"
      :before-close="handleClose"
    >
      <el-form
        label-position="top"
        label-width="120px"
        ref="stickerFormIns"
        :rules="formRules"
        :model="formData"
      >
        <el-row :gutter="48">
          <el-col :span="12">
            <el-form-item label="分类名称" prop="stickerName">
              <el-input
                :disabled="props?.dataset?.datas?.id"
                v-model="formData.stickerName"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="封面图片" prop="stickerUrl">
              <div class="form-image-line" v-loading="uploadLoading">
                <el-upload
                  class="avatar-uploader"
                  :action="beseUploadUrl"
                  :with-credentials="true"
                  :show-file-list="false"
                  :before-upload="beforeUploadHandler"
                  :on-success="handleAvatarSuccess"
                >
                  <img
                    v-if="formData.stickerUrl"
                    @click.stop="handlePictureCardPreview(formData.stickerUrl)"
                    v-lazy="formData.stickerUrl"
                    class="avatar"
                  />
                  <el-icon v-else class="el-icon-plus avatar-uploader-icon"
                    ><Plus
                  /></el-icon>
                </el-upload>
                <el-icon
                  @click="iconDelete"
                  v-show="formData.stickerUrl"
                  class="el-icon-delete"
                  ><Delete
                /></el-icon>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input
                :rows="2"
                type="textarea"
                v-model="formData.description"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="贴纸列表" prop="stickerChildlist">
              <div class="sticker-list-container">
                <el-upload
                  v-model:file-list="formData.stickerChildlist"
                  :action="beseUploadUrl"
                  list-type="picture-card"
                  :on-preview="
                    (value) => handlePictureCardPreview(value, 'list')
                  "
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="button-container">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          @click="submitHandler"
          v-loading="submitLoading"
          >保存</el-button
        >
      </div>
    </el-dialog>
    <el-dialog v-model="previewDialog.show" title="图片预览">
      <div class="preview-dialog-container">
        <img w-full v-lazy="previewDialog.url" alt="Preview Image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { createPhoneSticker } from "@/api/sticker";
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { buildImageUrl } from "@/utils/index.js";
import config from "~/config";
const beseUploadUrl = config[import.meta.env.MODE].uploadUrl;
const emit = defineEmits();
const stickerFormIns = ref(null);
const submitLoading = ref(false);
const previewDialog = ref({
  show: false,
  url: "",
});
const formData = ref({
  stickerName: "",
  stickerUrl: "",
  description: "",
  id: "",
  stickerChildlist: [],
});

const checkUrlUpload = (rule, value, callback) => {
  if (!formData.value.stickerUrl) {
    return callback(new Error("请上传封面照片！"));
  }
  callback();
};
const formRules = ref({
  stickerName: [
    { required: true, message: "请输入分类名称！", trigger: "blur" },
  ],
  stickerUrl: [{ validator: checkUrlUpload, trigger: ["change", "blur"] }],
});
const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {};
    },
  },
});
watch(
  props.dataset,
  (datas) => {
    initAndDisplayDatas(datas);
  },
  { deep: true }
);
const initAndDisplayDatas = (datas) => {
  if (!datas.datas.id) return;
  const { stickerName, stickerUrl, id, description, stickerChildlist } =
    datas.datas;
  formData.value = {
    stickerName,
    stickerUrl,
    id,
    description,
    stickerChildlist,
  };
};
const iconDelete = () => {
  formData.value.stickerUrl = "";
};
const handleClose = (flag) => {
  resetForm();
  emit("close", flag);
};
const resetForm = () => {
  formData.value = {
    stickerName: "",
    stickerUrl: "",
    id: "",
    description: "",
    stickerChildlist: [],
  };
};
const uploadLoading = ref(false);
const beforeUploadHandler = () => {
  uploadLoading.value = true;
};
const handleAvatarSuccess = (response, uploadFile) => {
  formData.value.stickerUrl = buildImageUrl(response.data);
  stickerFormIns.value.validateField("stickerUrl", () => null);
  uploadLoading.value = false;
};
const handlePictureCardPreview = (uploadFile, type) => {
  if (type === "list") {
    previewDialog.value.url = uploadFile.url;
  } else {
    previewDialog.value.url = uploadFile;
  }
  previewDialog.value.show = true;
};
const submitHandler = () => {
  stickerFormIns.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      const { stickerName, stickerUrl, description, id } = formData.value;
      const params = {
        stickerName,
        stickerUrl,
        description,
        id,
        stickerChildlist: formData.value.stickerChildlist.map((item) => {
          return {
            stickerChildName: item.stickerChildName || item.name,
            url: buildImageUrl(item.response ? item.response.data : item.url),
          };
        }),
      };
      createPhoneSticker(params)
        .then((res) => {
          if (res.code === 200) {
            ElMessage({
              message: "保存成功!",
              type: "success",
            });
            handleClose(true);
          }
        })
        .finally(() => {
          submitLoading.value = false;
        });
    }
  });
};
</script>

<style lang="less" scoped>
.sticker-dialog-component {
  .avatar-uploader {
    border: 1px dotted #ccc;
    height: 80px;
    width: 80px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
  .form-image-line {
    display: flex;
    .el-icon-delete {
      color: #ff0000;
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .button-container {
    text-align: right;
  }
  .preview-dialog-container {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 400px;
      width: 400px;
    }
  }
  .sticker-list-container {
    max-height: 400px;
    overflow: auto;
  }
}
</style>