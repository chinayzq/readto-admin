<template>
  <div class="pay-detail-dialog">
    <el-dialog
      v-model="dialogShow"
      :close-on-click-modal="false"
      :title="props?.dataset?.title"
      width="900"
      :before-close="handleClose"
    >
      <el-row :gutter="20" class="details-container" v-loading="dialogLoading">
        <el-col :span="8" class="single-item">
          <span class="label"> 头像： </span>
          <span class="value">
            <img class="list-user-icon" v-if="payDetails.headImg" :src="payDetails.headImg" alt="" />
            <img class="list-user-icon" v-else src="@/assets/user/user_default_icon.png" alt="" />
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 昵称： </span>
          <span class="value">
            {{ payDetails.nickeName }}
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> id： </span>
          <span class="value">
            {{ payDetails.id }}
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 订单号： </span>
          <span class="value">
            {{ payDetails.orderId }}
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 提现金额： </span>
          <span class="value">
            {{ payDetails.money }}
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 扣除金币： </span>
          <span class="value">
            {{ payDetails.gold }}
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 收款通道： </span>
          <span class="value"> - </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 状态： </span>
          <span :class="['value', `status-span-${payDetails.status}`]">
            {{ statusMap[payDetails.status] }}
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 备注说明： </span>
          <span class="value">
            {{ payDetails.mome }}
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 操作人： </span>
          <span class="value"> - </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 申请时间： </span>
          <span class="value">
            {{ formatDateTime(payDetails.createTime) }}
          </span>
        </el-col>
        <el-col :span="8" class="single-item">
          <span class="label"> 操作时间： </span>
          <span class="value">
            {{ formatDateTime(payDetails.updateTime) }}
          </span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { getPayDetailById } from '@/api/payment'
import { formatDateTime } from '@/utils'

const statusMap = ref({
  1: '待审核',
  2: '支付中',
  3: '支付成功',
  4: '支付失败',
  5: '驳回'
})

const props = defineProps({
  dataset: {
    type: Object,
    default() {
      return {}
    }
  }
})
const dialogShow = computed(() => props.dataset.show)
watch(
  () => props.dataset,
  (row) => {
    if (row.datas.id) {
      displayDatas(row.datas.id)
    }
  },
  { deep: true }
)
const payDetails = ref({})
const dialogLoading = ref(false)
const displayDatas = (id) => {
  dialogLoading.value = true
  getPayDetailById({ id })
    .then((res) => {
      payDetails.value = res.data
    })
    .finally(() => {
      dialogLoading.value = false
    })
}

const emit = defineEmits(['close'])
const handleClose = () => {
  emit('close')
}
</script>

<style scoped lang="scss">
.details-container {
  .single-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    .label {
      flex: 1;
      text-align: right;
    }
    .value {
      flex: 1;
      .list-user-icon {
        height: 40px;
        width: 40px;
      }
    }
    .status-span-1 {
      color: blue;
    }
    .status-span-3 {
      color: #2af12a;
    }
    .status-span-5 {
      color: #ff0000;
    }
  }
}
</style>
