<template>
  <div class="gold-operaion-dialog">
    <el-dialog
      v-model="dialogShow"
      :close-on-click-modal="false"
      title="金币操作"
      width="600"
      :before-close="handleClose"
    >
      <div class="gold-operaion-detail">
        <div class="detail-line">
          <span class="label">用户：</span>
          <span class="value">{{ goldForm.nickeName }}</span>
        </div>
        <div class="detail-line">
          <span class="label">操作：</span>
          <span class="value">
            <el-radio-group v-model="goldForm.calcType">
              <el-radio label="1">增加</el-radio>
              <el-radio label="2">减少</el-radio>
            </el-radio-group>
          </span>
        </div>
        <div class="detail-line">
          <span class="label">原金币：</span>
          <span class="value">{{ goldForm.accumulatedGoldCoins }}</span>
        </div>
        <div class="detail-line">
          <span class="label">操作金币：</span>
          <span class="value">
            <el-input-number style="width: 100%" v-model="goldForm.amount" :min="0" :max="9999" />
          </span>
        </div>
        <div class="detail-line">
          <span class="label">操作说明：</span>
          <span class="value">
            <el-input
              style="width: 100%"
              v-model="goldForm.optDes"
              :rows="2"
              type="textarea"
              placeholder="输入操作原因或标注，将以站内信发给用户！"
            />
          </span>
        </div>
        <div class="button-line">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="goldOpeSubmit">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { userGoldOperation } from "@/api/user"
import { ElMessage } from "element-plus"

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
const dialogShow = computed(() => props.dialogVisible)
watch(
  () => props.dataset,
  (datas) => {
    console.log("datas", datas)
    goldForm.value.nickeName = datas.nickeName
    goldForm.value.accumulatedGoldCoins = datas.accumulatedGoldCoins
    goldForm.value.userId = datas.id
  },
  { deep: true }
)

const emit = defineEmits(["close"])
const handleClose = (flag) => {
  emit("close", flag)
}

const goldForm = ref({
  nickeName: null,
  accumulatedGoldCoins: 0,
  userId: null,
  optDes: null,
  amount: 0,
  calcType: "1"
})
const submitLoading = ref(false)
const goldOpeSubmit = () => {
  submitLoading.value = true
  userGoldOperation(goldForm.value)
    .then((res) => {
      if (res.code === 1) {
        ElMessage.success("金币更新成功！")
        handleClose(true)
      }
    })
    .finally(() => {
      submitLoading.value = false
    })
}
</script>

<style lang="scss" scoped>
.gold-operaion-dialog {
  .gold-operaion-detail {
    .detail-line {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .label {
        text-align: right;
        width: 150px;
        margin-right: 20px;
      }
      .value {
        flex: 1;
      }
      & > span {
        display: inline-block;
      }
    }
    .button-line {
      text-align: right;
    }
  }
}
</style>
