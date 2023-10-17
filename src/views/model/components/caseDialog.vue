<template>
  <div class="phone-case-dialog">
    <el-dialog
      v-model="props.dataset.show"
      :title="props.dataset.title"
      width="1000"
      :before-close="handleClose"
    >
      <el-button type="primary" @click="addNewCase">新增手机壳</el-button>
      <div class="single-item" v-for="(item, index) in itemList" :key="index">
        <div class="left-part">
          <div class="single-upload" v-loading="item.uploadLoading1">
            <!-- 手机壳图片上传 -->
            <el-upload
              class="avatar-uploader"
              :action="beseUploadUrl"
              :with-credentials="true"
              :show-file-list="false"
              :before-upload="
                () => {
                  beforeUploadHandler(index);
                }
              "
              :on-success="
                (response, uploadFile) => {
                  handleAvatarSuccess(response, uploadFile, index);
                }
              "
            >
              <img
                v-if="item.url"
                @click.stop="handlePictureCardPreview(item.url)"
                v-lazy="item.url"
                class="avatar"
              />
              <el-icon v-else class="el-icon-plus avatar-uploader-icon"
                >手机壳图片<Plus
              /></el-icon>
            </el-upload>
            <el-icon
              @click="iconDelete(item)"
              v-show="item.url"
              class="el-icon-delete"
              ><Delete
            /></el-icon>
          </div>
          <div class="single-upload" v-loading="item.uploadLoading2">
            <!-- 手机壳样例上传 -->
            <el-upload
              class="avatar-uploader"
              :action="beseUploadUrl"
              :with-credentials="true"
              :show-file-list="false"
              :before-upload="
                () => {
                  beforeUploadHandler2(index);
                }
              "
              :on-success="
                (response, uploadFile) => {
                  handleAvatarSuccess2(response, uploadFile, index);
                }
              "
            >
              <img
                v-if="item.exampleUrl"
                @click.stop="handlePictureCardPreview(item.exampleUrl)"
                v-lazy="item.exampleUrl"
                class="avatar"
              />
              <el-icon v-else class="el-icon-plus avatar-uploader-icon"
                >样例图片<Plus
              /></el-icon>
            </el-upload>
            <el-icon
              @click="iconDelete2(item)"
              v-show="item.url"
              class="el-icon-delete"
              ><Delete
            /></el-icon>
          </div>
        </div>
        <div class="right-part">
          <el-row :gutter="48">
            <el-col :span="12" class="single-item-line">
              <span class="item-label"> 手机壳名称： </span>
              <el-input
                v-model="item.colorName"
                placeholder="color name"
              ></el-input>
            </el-col>
            <el-col :span="12" class="single-item-line">
              <span class="item-label"> 现格： </span>
              <el-input
                v-model="item.curPrice"
                placeholder="current price"
              ></el-input>
            </el-col>
            <el-col :span="12" class="single-item-line">
              <span class="item-label"> 原价： </span>
              <el-input
                v-model="item.oriPrice"
                placeholder="original price"
              ></el-input>
            </el-col>
            <el-col :span="12" class="single-item-line">
              <span class="item-label"> 描述： </span>
              <el-input
                v-model="item.description"
                placeholder="description"
              ></el-input>
            </el-col>
            <el-col :span="12" class="single-item-line">
              <span class="item-label"> 尺寸描述： </span>
              <el-input
                v-model="item.extend1"
                placeholder="size description"
              ></el-input>
            </el-col>
            <el-col :span="12" class="single-item-line">
              <span class="item-label"> 摄像头描述： </span>
              <el-input
                v-model="item.extend2"
                placeholder="camera description"
              ></el-input>
            </el-col>
            <el-col :span="12" class="single-item-line">
              <span class="item-label"> SKU： </span>
              <el-input v-model="item.extend3" placeholder="sku"></el-input>
            </el-col>
            <el-col
              :span="12"
              class="single-item-line"
              style="display: flex; justify-content: end"
            >
              <el-button type="danger" @click="deleteCurrentItem(index)">
                删除
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
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
watch(
  props.dataset,
  (datas) => {
    initAndDisplayDatas(datas);
  },
  { deep: true }
);

const itemList = ref([]);
const initAndDisplayDatas = (datas) => {
  if (!datas.type) return;
  const { type, phoneCode } = datas;
  getPhoneColor({ type, phoneCode }).then((res) => {
    if (res.code === 200) {
      itemList.value = res.data[0].colorUrlList;
    }
  });
};

const saveHandler = () => {
  const params = {
    type: 2,
    phoneCode: props.dataset.phoneCode,
    colorUrlList: itemList.value.map((item) => {
      return {
        url: item.url,
        exampleUrl: item.exampleUrl,
        colorName: item.colorName,
        curPrice: item.curPrice,
        oriPrice: item.oriPrice,
        description: item.description,
        extend1: item.extend1,
        extend2: item.extend2,
        extend3: item.extend3,
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

const addNewCase = () => {
  itemList.value.unshift({
    url: null,
    exampleUrl: null,
    colorName: null,
    curPrice: null,
    oriPrice: null,
    description: null,
    extend1: null,
    extend2: null,
    extend3: null,
    uploadLoading1: false,
    uploadLoading2: false,
  });
};
const iconDelete = (item) => {
  item.url = "";
};
const iconDelete2 = (item) => {
  item.exampleUrl = "";
};
const deleteCurrentItem = (index) => {
  itemList.value.splice(index, 1);
};
const handleClose = () => {
  emit("close");
};

const previewDialog = ref({
  show: false,
  url: "",
});
const handlePictureCardPreview = (uploadFile) => {
  previewDialog.value.url = uploadFile;
  previewDialog.value.show = true;
};

const beforeUploadHandler = (index) => {
  itemList.value[index].uploadLoading1 = true;
};
const beforeUploadHandler2 = (index) => {
  itemList.value[index].uploadLoading2 = true;
};
const handleAvatarSuccess = (response, uploadFile, index) => {
  itemList.value[index].url = buildImageUrl(response.data);
  itemList.value[index].uploadLoading1 = false;
};
const handleAvatarSuccess2 = (response, uploadFile, index) => {
  itemList.value[index].exampleUrl = buildImageUrl(response.data);
  itemList.value[index].uploadLoading2 = false;
};
</script>

<style lang="less" scoped>
.phone-case-dialog {
  .button-container {
    margin-top: 10px;
    text-align: right;
  }
  .single-item-line {
    display: flex;
    align-items: center;
    .item-label {
      display: inline-block;
      min-width: 135px;
      text-align: right;
    }
  }
  .single-item {
    display: flex;
    margin-top: 20px;
    min-height: 222px;
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    .left-part {
      min-width: 220px;
      display: flex;
      flex-direction: column;
      gap: 20px 0;
      .single-upload {
        display: flex;
      }
    }
    .right-part {
      display: flex;
    }
    .avatar-uploader {
      // border: 1px dotted #ccc;
      // height: 80px;
      // width: 80px;
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
      color: #000;
      font-size: 14px;
      font-weight: bold;
      width: 110px;
      height: 110px;
      text-align: center;
      border: 1px solid #ccc;
    }
    .avatar {
      width: 110px;
      // width: 80px;
      // height: 80px;
      display: block;
    }
    .el-icon-delete {
      color: #ff0000;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
</style>