<template>
  <div class="gold-operaion-dialog">
    <el-dialog
      v-model="props.dialogVisible"
      :close-on-click-modal="false"
      title="金币操作"
      width="600"
      :before-close="handleClose"
    >
      <div class="gold-operaion-detail">
        <div class="detail-line">
          <span class="label">用户：</span>
          <span class="value">刘德华</span>
        </div>
        <div class="detail-line">
          <span class="label">操作：</span>
          <span class="value">
            <el-radio-group v-model="operationType">
              <el-radio label="1">增加</el-radio>
              <el-radio label="2">减少</el-radio>
            </el-radio-group>
          </span>
        </div>
        <div class="detail-line">
          <span class="label">原金币：</span>
          <span class="value">1234</span>
        </div>
        <div class="detail-line">
          <span class="label">操作金币：</span>
          <span class="value">
            <el-input-number style="width: 100%" v-model="operationCount" :min="1" :max="9999" />
          </span>
        </div>
        <div class="detail-line">
          <span class="label">操作说明：</span>
          <span class="value">
            <el-input
              style="width: 100%"
              v-model="operationDescription"
              :rows="2"
              type="textarea"
              placeholder="输入操作原因或标注，将以站内信发给用户！"
            />
          </span>
        </div>
        <div class="button-line">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue"

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
const handleClose = (flag) => {
  emit("close", flag)
}

const operationType = ref("1")
const operationCount = ref(0)
const operationDescription = ref(null)
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
