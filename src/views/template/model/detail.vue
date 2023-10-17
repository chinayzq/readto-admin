<template>
  <div
    class="template-detail-component"
    v-loading="saveLoading"
    element-loading-text="效果图拼命渲染中..."
    @click="clearActiveState"
  >
    <div class="basic-image-part">
      <div class="common-title">基础信息</div>
      <el-form
        label-position="top"
        label-width="120px"
        ref="templateFormIns"
        :rules="formRules"
        :model="formData"
      >
        <el-form-item prop="templateName">
          <el-input
            v-model="formData.templateName"
            class="model-selector"
            placeholder="请输入模板名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="oneLevelCategory">
          <el-select
            class="model-selector"
            v-model="formData.oneLevelCategory"
            filterable
            placeholder="选择模板分类"
          >
            <el-option
              v-for="item in oneLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="selectModel">
          <el-select
            class="model-selector"
            v-model="formData.selectModel"
            filterable
            @change="modelChange"
            placeholder="选择机型"
          >
            <el-option
              v-for="item in modelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div v-loading="imageContainerLoading">
        <div class="item-title">机型图片</div>
        <div class="model-image-list" v-if="modelImageList.length">
          <div
            :class="['singl-model-image', item.active && 'single-image-active']"
            v-for="item in modelImageList"
            :key="item.url"
            @click="setSelectImage('model', item, modelImageList)"
          >
            <img v-lazy="item.url" alt="" />
          </div>
        </div>
        <div class="no-data" v-else>暂无数据</div>

        <div class="item-title">手机壳图片</div>
        <div class="model-image-list" v-if="caseImageList.length">
          <div
            :class="['singl-model-image', item.active && 'single-image-active']"
            v-for="item in caseImageList"
            :key="item.url"
            @click="setSelectImage('case', item, caseImageList)"
          >
            <img v-lazy="item.url" alt="" />
          </div>
        </div>
        <div class="no-data" v-else>暂无数据</div>

        <div class="item-title">模板图片</div>
        <div class="model-image-list" v-if="maskImageList.length">
          <div
            :class="['singl-model-image', item.active && 'single-image-active']"
            v-for="item in maskImageList"
            :key="item.url"
            @click="setSelectImage('mask', item, maskImageList)"
          >
            <img v-lazy="item.url" alt="" />
          </div>
        </div>
        <div class="no-data" v-else>暂无数据</div>
      </div>
    </div>
    <div class="center-container">
      <div class="common-title center-title">
        <span> 模板配置 </span>
        <span>
          <el-button type="primary" @click="saveTemplate">保存</el-button>
        </span>
      </div>
      <div class="graph-container" id="graph-container">
        <img
          style="z-index: 1"
          class="single-graph-image"
          v-if="selectModelImage"
          :src="selectModelImage"
          alt=""
        />
        <img
          style="z-index: 2"
          class="single-graph-image"
          v-if="selectCaseImage"
          :src="selectCaseImage"
          alt=""
        />
        <div
          :style="{
            zIndex: 3,
            maskImage: `url(${selectMaskImage})`,
          }"
          @mousemove="
            (event) => {
              moveHandler(event, item);
            }
          "
          class="mask-container"
          id="mask-container"
        >
          <!-- 该图只为撑起来mask容器 -->
          <img
            style="position: relative; width: 300px; z-index: -1"
            :src="selectModelImage"
            alt=""
          />
          <div
            @mousedown="
              (event) => {
                dragStartHandler(event, item);
              }
            "
            @click.stop="activeItem(item)"
            @mouseup="eventEndHandler"
            v-for="item in dragStickerList"
            :id="`drag_dom_${item.id}`"
            :key="item.id"
            :style="{
              height: `${item.height}px`,
              width: `${item.width}px`,
              top: `${item.top}px`,
              left: `${item.left}px`,
              transform: `rotate(${item.rotate}deg)`,
              zIndex: item.active ? 9999 : `${item.zIndex}`,
            }"
            :class="['drag-image', item.active && 'drag-image-active']"
          >
            <img
              draggable="false"
              style="height: 100%; width: 100%"
              :src="item.url"
              alt=""
            />
            <template v-if="item.active">
              <img
                draggable="false"
                @click.stop="iconDeleteHandler(item)"
                :src="DeleteIcon"
                class="operation-icon delete-icon"
                alt=""
              />
              <!-- <span class="replace-icon"> Replace </span> -->
              <img
                draggable="false"
                @click.stop="iconCopyHandler(item)"
                :src="PlusIcon"
                class="operation-icon plus-icon"
                alt=""
              />
              <div
                @mousedown.stop.prevent="
                  (event) => {
                    resizeStart(event, item);
                  }
                "
                class="operation-icon resize-icon"
              >
                <img draggable="false" :src="ResizeIcon" alt="" />
              </div>
              <img
                draggable="false"
                @mousedown.stop.prevent="
                  (event) => {
                    rotateStart(event, item);
                  }
                "
                :src="RotateIcon"
                class="operation-icon rotate-icon"
                alt=""
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="sticker-part">
      <div class="common-title">贴纸</div>
      <StickerCollapse @add="addStickerToGraph" />
    </div>
    <a id="aBase64Url" download style="display: none">
      <img src="" id="base64Url" />
    </a>
    <!-- 该canvas节点用来导出模板图片渲染用 -->
    <canvas
      id="myCanvas"
      width="300"
      height="588"
      style="display: none"
    ></canvas>
  </div>
</template>

<script setup name="template-detail-component">
import { ref, onBeforeMount, onMounted } from "vue";
import { getPhoneColor, getModelList } from "@/api/model";
import { getItemByClassId } from "@/api/dictionary";
import { updateTemplate, getTemplateDetail } from "@/api/template";
import { useRoute, useRouter } from "vue-router";
import { uuid } from "@/utils";
import { ElMessage } from "element-plus";
import { exportAsImage } from "@/utils/domToImage";
import DeleteIcon from "@/assets/images/drag_delete_icon.png";
import PlusIcon from "@/assets/images/drag_plus_icon.svg";
import ResizeIcon from "@/assets/images/drag_resize_icon.png";
import RotateIcon from "@/assets/images/drag_rotate_icon.svg";
import StickerCollapse from "../components/stickerCollapse.vue";

const route = useRoute();
onBeforeMount(() => {
  initModelList();
  initOneLevelOptions();
  const { templateId } = route.query;
  if (templateId) {
    initTemplateDetails(templateId);
  }
});

onMounted(() => {});

const formData = ref({
  templateName: null,
  oneLevelCategory: null,
  selectModel: null,
});
const formRules = ref({
  templateName: [
    {
      required: true,
      message: "请输入模板名称!",
      trigger: ["blur", "change"],
    },
  ],
  oneLevelCategory: [
    {
      required: true,
      message: "请选择所属模板分类!",
      trigger: ["blur", "change"],
    },
  ],
  selectModel: [
    {
      required: true,
      message: "请选择机型!",
      trigger: ["blur", "change"],
    },
  ],
});
/**
 * 初始化模板详情数据
 */
const initTemplateDetails = (templateId) => {
  getTemplateDetail({ templateId }).then((res) => {
    if (res.code === 200) {
      const { templateData, phoneCode } = res.data;
      dragStickerList.value = templateData.basedata;
      formData.value.selectModel = phoneCode;
      formData.value.templateName = res.data.templateName;
      modelChange(phoneCode, templateData);
    } else {
      ElMessage.warning("获取模板数据失败！");
    }
  });
};

/**
 * 选择机型
 */
const modelOptions = ref([]);
const initModelList = () => {
  getModelList().then((res) => {
    if (res.code === 200) {
      modelOptions.value = res.data.map((item) => {
        return {
          value: item.phoneCode,
          label: item.phoneName,
        };
      });
    }
  });
};
const modelChange = (model, selectImages) => {
  getModelImages(model, selectImages);
};

/**
 * 机型图片
 */
const imageContainerLoading = ref(false);
const modelImageList = ref([]);
const caseImageList = ref([]);
const maskImageList = ref([]);
const getModelImages = (phoneCode, selectImages) => {
  imageContainerLoading.value = true;
  getPhoneColor({ phoneCode })
    .then((res) => {
      if (res.code === 200) {
        modelImageList.value = res.data
          .filter((item) => item.type === "1")
          .map((item) => item.colorUrlList)[0]
          .map((item) => {
            return {
              ...item,
              ...{ active: false },
            };
          });
        caseImageList.value = res.data
          .filter((item) => item.type === "2")
          .map((item) => item.colorUrlList)[0]
          .map((item) => {
            return {
              ...item,
              ...{ active: false },
            };
          });
        maskImageList.value = res.data
          .filter((item) => item.type === "3")
          .map((item) => item.colorUrlList)[0]
          .map((item) => {
            return {
              ...item,
              ...{ active: false },
            };
          });
      } else {
        modelImageList.value = [];
        caseImageList.value = [];
        maskImageList.value = [];
      }
    })
    .finally(() => {
      imageContainerLoading.value = false;
      if (selectImages) {
        const { modelImage, caseImage, maskImage } = selectImages;
        const modelItem = modelImageList.value.filter(
          (item) => item.url === modelImage
        )[0];
        setSelectImage("model", modelItem, modelImageList.value);
        const caseItem = caseImageList.value.filter(
          (item) => item.url === caseImage
        )[0];
        setSelectImage("case", caseItem, caseImageList.value);
        const maskItem = maskImageList.value.filter(
          (item) => item.url === maskImage
        )[0];
        setSelectImage("mask", maskItem, maskImageList.value);
      }
    });
};

/**
 * 设置图片
 */
const selectModelImage = ref(null);
const selectCaseImage = ref(null);
const selectMaskImage = ref(null);
const setSelectImage = (type, item, itemList) => {
  switch (type) {
    case "model":
      selectModelImage.value = item.url;
      break;
    case "case":
      selectCaseImage.value = item.url;
      break;
    case "mask":
      selectMaskImage.value = item.url;
      break;
  }
  itemList.forEach((single) => {
    single.active = false;
  });
  item.active = true;
};

/**
 * 选择模板分类
 */
const oneLevelOptions = ref([]);
const initOneLevelOptions = () => {
  getItemByClassId({
    classId: "19",
  })
    .then((res) => {
      if (res.code === 200) {
        oneLevelOptions.value = res.data.map((item) => {
          return {
            label: item.itemName,
            value: item.itemCode,
          };
        });
        console.log("oneLevelOptions.value", oneLevelOptions.value);
      }
    })
    .finally(() => {
      const { typeCode } = route.query;
      if (typeCode) {
        formData.value.oneLevelCategory = typeCode;
      }
    });
};

const dragStickerList = ref([
  // {
  //   id: "xxx1",
  //   url: "/diyadmin/download?fileId=a377ec418cae49bf80fbde0fdec415ff",
  //   height: 100,
  //   width: 100,
  //   top: 200,
  //   left: 50,
  //   rotate: 0,
  //   zIndex: 1001,
  //   active: false,
  // },
]);
const addStickerToGraph = (url) => {
  dragStickerList.value.push({
    id: uuid(),
    url,
    height: 100,
    width: 100,
    top: 280,
    left: 100,
    zIndex: getMaxIndex(),
    active: false,
  });
};
const activeItem = (dragItem) => {
  clearActiveState();
  dragItem.active = true;
};
// 清除所有拖拽图形active状态
const clearActiveState = () => {
  dragStickerList.value.forEach((item) => {
    item.active = false;
  });
};
// 获取addStickerToGraph最大Index
const getMaxIndex = () => {
  if (dragStickerList.value.length) {
    let count = 0;
    dragStickerList.value.forEach((item) => {
      if (item.zIndex > count) {
        count = item.zIndex;
      }
    });
    return count + 1;
  } else {
    return 1000;
  }
};

let currentItem = {};
// move事件处理
const moveHandler = (event) => {
  if (draggingItem.start) {
    dragHandler(event, currentItem);
  }
  if (resizeObj.start) {
    resizeMove(event, currentItem);
  }
  if (rotateObj.start) {
    rotating(event, currentItem);
  }
};

// icon - 拖拽
const draggingItem = {
  x: 0,
  y: 0,
  start: false,
};
const dragHandler = (event, item) => {
  const { clientX, clientY } = event;
  if (clientY === 0 || clientX === 0 || !draggingItem.start) return;
  const xDiff = clientX - draggingItem.x;
  const yDiff = clientY - draggingItem.y;
  draggingItem.x = clientX;
  draggingItem.y = clientY;
  item.top = item.top + yDiff;
  item.left = item.left + xDiff;
};
const dragStartHandler = (event, item) => {
  currentItem = item;
  console.log("currentItem", currentItem);
  draggingItem.start = true;
  const { clientX, clientY } = event;
  draggingItem.x = clientX;
  draggingItem.y = clientY;
};
const dragEndHandler = (event, item) => {
  draggingItem.start = false;
};

// icon - 删除
const iconDeleteHandler = ({ id }) => {
  dragStickerList.value = dragStickerList.value.filter(
    (item) => item.id !== id
  );
};

// icon - 复制
const iconCopyHandler = (item) => {
  const { url, height, width, top, left } = item;
  dragStickerList.value.push({
    id: uuid(),
    url,
    height,
    width,
    top: top + 40,
    left: left + 40,
    zIndex: getMaxIndex(),
    active: false,
  });
};

// icon - 改变大小
const resizeObj = {
  start: false,
  x: 0,
  y: 0,
};
const resizeStart = (event, item) => {
  event.preventDefault();
  currentItem = item;
  const { clientX, clientY } = event;
  resizeObj.start = true;
  resizeObj.x = clientX;
  resizeObj.y = clientY;
};
const resizeMove = (event, item) => {
  if (!resizeObj.start) return;
  const { clientX, clientY } = event;
  const xDiff = clientX - resizeObj.x;
  const yDiff = clientY - resizeObj.y;
  resizeObj.x = clientX;
  resizeObj.y = clientY;
  item.height = item.height + yDiff;
  item.width = item.width + xDiff;
};
const resizeEnd = (event, item) => {
  resizeObj.start = false;
};

// icon - 旋转
let rotateObj = {
  start: false,
  rotate: 0,
};
let pointA = {
  X: 0,
  Y: 0,
};
let pointB = {};
let pointC = {};
const rotateStart = (event, item) => {
  currentItem = item;
  rotateObj.start = true;
  // 计算元素中心点
  const { height, width, id } = item;
  const currentDom = document.getElementById(`drag_dom_${id}`);
  const { left, top } = currentDom.getBoundingClientRect();
  pointA.X = width / 2 + left;
  pointA.Y = height / 2 + top;
  // 记录起始坐标
  pointB.X = event.pageX;
  pointB.Y = event.pageY;
  // 计算元素中心点
  // pointA.X = event.pageX - width / 2;
  // pointA.Y = event.pageY - height / 2;
  // 记录已有旋转角度
  rotateObj.rotate = item.rotate;
};
const rotating = (event, item) => {
  if (!rotateObj.start) return;
  pointC.X = event.pageX;
  pointC.Y = event.pageY; // 获取结束点坐标
  // 计算出旋转角度
  const AB = {};
  const AC = {};
  AB.X = pointB.X - pointA.X;
  AB.Y = pointB.Y - pointA.Y;
  AC.X = pointC.X - pointA.X;
  AC.Y = pointC.Y - pointA.Y; // 分别求出AB,AC的向量坐标表示
  const direct = AB.X * AC.Y - AB.Y * AC.X; // AB与AC叉乘求出逆时针还是顺时针旋转
  const lengthAB = Math.sqrt(
      Math.pow(pointA.X - pointB.X, 2) + Math.pow(pointA.Y - pointB.Y, 2)
    ),
    lengthAC = Math.sqrt(
      Math.pow(pointA.X - pointC.X, 2) + Math.pow(pointA.Y - pointC.Y, 2)
    ),
    lengthBC = Math.sqrt(
      Math.pow(pointB.X - pointC.X, 2) + Math.pow(pointB.Y - pointC.Y, 2)
    );
  const cosA =
    (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) /
    (2 * lengthAB * lengthAC); //   余弦定理求出旋转角
  const angleA = Math.round((Math.acos(cosA) * 180) / Math.PI);
  let allA = 0;
  if (direct < 0) {
    allA = -angleA; //叉乘结果为负表示逆时针旋转， 逆时针旋转减度数
  } else {
    allA = angleA; //叉乘结果为正表示顺时针旋转，顺时针旋转加度数
  }
  console.log("allA", allA);
  // 如果上一次按下旋转已经有度数,需要加上上一次的度数
  if (rotateObj.rotate) {
    allA += rotateObj.rotate;
  }
  item.rotate = allA;
};

const rotateEnd = (event, item) => {
  console.log("rotateEnd");
  rotateObj.start = false;
  rotateObj.rotate = 0;
  pointA = {};
  pointB = {};
  pointC = {};
  // currentItem = {};
};

const eventEndHandler = () => {
  rotateEnd();
  resizeEnd();
  dragEndHandler();
};

const router = useRouter();
const saveLoading = ref(false);
const templateFormIns = ref(null);
const saveTemplate = async () => {
  // form必填校验
  const validFlag = await templateFormIns.value.validate();
  if (!validFlag) return;
  saveLoading.value = true;
  // 清除画布active
  clearActiveState();
  // 将画布保存为图片
  const templateUrl = await exportAsImage("mask-container", {
    mask: selectMaskImage.value,
    model: selectModelImage.value,
    caseImage: selectCaseImage.value,
  });
  const params = {
    phoneCode: formData.value.selectModel,
    templateData: {
      basedata: dragStickerList.value,
      modelImage: selectModelImage.value,
      caseImage: selectCaseImage.value,
      maskImage: selectMaskImage.value,
    },
    typeCode: formData.value.oneLevelCategory,
    description: "",
    templateName: formData.value.templateName,
    templateUrl,
    templateId: route?.query?.templateId || "",
  };
  updateTemplate(params)
    .then((res) => {
      if (res.code === 200) {
        ElMessage({
          message: "模板保存成功！",
          type: "success",
        });
        setTimeout(() => {
          router.push("/template");
        }, 2000);
      }
    })
    .finally(() => {
      saveLoading.value = false;
    });
};
</script>

<style lang="less" scoped>
.template-detail-component {
  height: 100%;
  display: flex;
  .basic-image-part {
    flex: 1;
    margin-right: 20px;
    padding-right: 10px;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    .model-selector {
      width: 100%;
      margin-bottom: 10px;
    }
    .item-title {
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      font-size: 12px;
      color: #333;
      border-bottom: 1px solid #ccc;
    }
    .model-image-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      .singl-model-image {
        cursor: pointer;
        width: 15%;
        padding: 10px 5%;
        margin: 10px 0;
        border: 1px solid #ffffff;
        img {
          width: 100%;
        }
      }
      .single-image-active {
        border: 1px solid #409eff;
      }
    }
    .mask-image-list {
      img {
        width: 15%;
      }
    }
  }
  .no-data {
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center-container {
    flex: 2;
    min-width: 500px;
    .graph-container {
      height: calc(100% - 30px);
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      .single-graph-image {
        width: 300px;
        position: absolute;
      }
      .mask-container {
        position: relative;
        // -webkit-mask-image: url("../../../assets/images/img_error.png");
        // -webkit-mask-image: url("../../../assets/images/mask_demo.png");
        -webkit-mask-size: cover;
        // -webkit-mask-image: url(https://oss.data.ideaskins.com.cn/diy/2023-5-5/4ea960dd-2565-4069-aa73-b6abaa5e1e27.png);
      }
      .drag-image {
        user-select: none;
        position: absolute;
        cursor: pointer;
        // background-image: url("../../../assets/images/login_background2.jpg");
        // background-size: 100% 100%;
        box-sizing: border-box;
        border: 1px solid #00000000;
        .operation-icon {
          cursor: pointer;
          height: 35px;
          width: 35px;
          position: absolute;
        }
        .delete-icon {
          left: -17.5px;
          top: -17.5px;
        }
        .replace-icon {
          display: inline-block;
          background: #ffffff;
          border-radius: 20px;
          padding: 5px 10px;
          color: #000;
          cursor: pointer;
          position: absolute;
          right: -33px;
          top: -18px;
          font-size: 14px;
        }
        .plus-icon {
          left: -17.5px;
          bottom: -17.5px;
        }
        .resize-icon {
          right: -17.5px;
          bottom: -17.5px;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: nw-resize;
          img {
            width: 25px;
            height: 25px;
          }
        }
        .rotate-icon {
          bottom: -50px;
          left: calc(50% - 17.5px);
        }
      }
      .drag-image-active {
        border: 1px solid #409eff;
      }
    }
  }
  .common-title {
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  .center-title {
    display: flex;
    justify-content: space-between;
  }
  .sticker-part {
    flex: 1;
    margin-left: 20px;
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
  }
}
</style>