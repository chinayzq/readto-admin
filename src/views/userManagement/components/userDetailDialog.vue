<template>
  <div class="user-detail-dialog">
    <el-dialog
      v-model="props.dialogVisible"
      :close-on-click-modal="false"
      title="用户详情"
      width="1000"
      :before-close="handleClose"
    >
      <div class="user-detail-container">
        <div class="title-line">账号信息</div>
        <el-row>
          <el-col class="detail-line" :span="12" v-for="(item, index) in countInfo" :key="index">
            <div class="label">{{ item.label }}：</div>
            <div>
              {{ item.value }}
            </div>
          </el-col>
        </el-row>
        <div class="title-line user-line">用户信息</div>
        <el-row>
          <el-col class="detail-line" :span="12" v-for="(item, index) in userInfo" :key="index">
            <div class="label">{{ item.label }}：</div>
            <div>
              {{ item.value }}
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue"

const countInfo = ref([
  {
    label: "ID",
    value: 123456
  },
  {
    label: "绑定手机",
    value: 13512341234
  },
  {
    label: "邮箱",
    value: "123456@qq.com"
  },
  {
    label: "注册IP",
    value: "192.168.0.0"
  },
  {
    label: "注册时间",
    value: "2023-10-10 08:08:08"
  },
  {
    label: "手机唯一识别码",
    value: "showmethemoney"
  },
  {
    label: "手机系统",
    value: "MIUI 12.0.1.1稳定版"
  }
])

const userInfo = ref([
  {
    label: "头像",
    value: null
  },
  {
    label: "昵称",
    value: "刘德华"
  },
  {
    label: "性别",
    value: "男"
  },
  {
    label: "累计金币",
    value: 12325
  },
  {
    label: "金币余额",
    value: 2344
  },
  {
    label: "上级",
    value: "张学友"
  },
  {
    label: "银行卡信息",
    value: 1235483745873645
  },
  {
    label: "邀请码",
    value: 555555
  },
  {
    label: "下级人数",
    value: 15
  }
])

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
  }
})
const emit = defineEmits(["close"])
const handleClose = () => {
  emit("close")
}
</script>

<style lang="scss" scoped>
.user-detail-dialog {
  .user-detail-container {
    .user-line {
      margin-top: 20px;
    }
    .title-line {
      font-size: 14px;
      font-weight: bold;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e5e5e5;
    }
    .detail-line {
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #e5e5e5;
      .label {
        text-align: right;
      }
      & > div {
        flex: 1;
      }
    }
  }
}
</style>
