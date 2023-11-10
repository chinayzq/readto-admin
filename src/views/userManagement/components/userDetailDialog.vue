<template>
  <div class="user-detail-dialog">
    <el-dialog
      v-model="props.dialogVisible"
      :close-on-click-modal="false"
      title="用户详情"
      width="1000"
      :before-close="handleClose"
    >
      <div class="user-detail-container" v-loading="dialogLoading">
        <div class="title-line">账号信息</div>
        <el-row>
          <el-col class="detail-line" :span="12" v-for="(item, index) in countInfo" :key="index">
            <div class="label">{{ item.label }}：</div>
            <div>
              <el-switch
                :disabled="true"
                v-if="item.key === 'userStatus'"
                v-model="item.value"
                :active-value="1"
                :inactive-value="0"
              />
              <span v-else>
                {{ item.value || "-" }}
              </span>
            </div>
          </el-col>
        </el-row>
        <div class="title-line user-line">用户信息</div>
        <el-row>
          <el-col class="detail-line" :span="12" v-for="(item, index) in userInfo" :key="index">
            <div class="label">{{ item.label }}：</div>
            <div class="flex-center">
              <img class="head-img" v-if="item.key === 'headImg'" :src="item.value" alt="" />
              <span v-else-if="item.key === 'gender'">
                {{ genderMap[item.value] }}
              </span>
              <span v-else>
                {{ item.value || item.value === 0 ? item.value : "-" }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { getUserDetail } from "@/api/user"
import { ref, watch } from "vue"

const countInfo = ref([
  {
    label: "ID",
    value: 123456,
    key: "id"
  },
  {
    label: "绑定手机",
    value: 13512341234,
    key: "bindPhone"
  },
  {
    label: "邮箱",
    value: "123456@qq.com",
    key: "email"
  },
  {
    label: "注册IP",
    value: "192.168.0.0",
    key: "registerIp"
  },
  {
    label: "注册时间",
    value: "2023-10-10 08:08:08",
    key: "registerTime"
  },
  {
    label: "手机唯一识别码",
    value: "showmethemoney",
    key: "phoneIdentification"
  },
  {
    label: "手机系统",
    value: "MIUI 12.0.1.1稳定版",
    key: "phoneSystemVersion"
  },
  {
    label: "封禁状态",
    value: 0,
    key: "userStatus"
  }
])

const userInfo = ref([
  {
    label: "头像",
    value: null,
    key: "headImg"
  },
  {
    label: "昵称",
    value: "",
    key: "nickeName"
  },
  {
    label: "性别",
    value: "",
    key: "gender"
  },
  {
    label: "累计金币",
    value: 0,
    key: "accumulatedGoldCoins"
  },
  {
    label: "金币余额",
    value: 0,
    key: "availableGoldCoins"
  },
  {
    label: "上级",
    value: "张学友"
  },
  {
    label: "银行卡信息",
    value: null
  },
  {
    label: "邀请码",
    value: null,
    key: "inviteCode"
  },
  {
    label: "下级人数",
    value: 0,
    key: "subCnt"
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
watch(
  () => props.dataset,
  (datas) => {
    console.log("datas", datas)
    if (datas.id) {
      initUserDialogDatas(datas.id)
    }
  },
  { deep: true }
)
const genderMap = ref({
  1: "男",
  2: "女",
  0: "未知"
})
const dialogLoading = ref(false)
const initUserDialogDatas = (id) => {
  dialogLoading.value = true
  getUserDetail({ id })
    .then((res) => {
      if (res.code === 1) {
        userInfo.value.forEach((item) => {
          if (item.key) {
            item.value = res.data[item.key]
          }
        })
        countInfo.value.forEach((item) => {
          if (item.key) {
            item.value = res.data[item.key]
          }
        })
      }
    })
    .finally(() => {
      dialogLoading.value = false
    })
}

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
      .flex-center {
        display: flex;
        align-items: center;
      }
      .head-img {
        width: 30px;
        height: 30px;
      }
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
