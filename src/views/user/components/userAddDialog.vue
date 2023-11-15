<template>
  <div class="add-user-dialog">
    <el-dialog
      v-model="props.dialogVisible"
      :close-on-click-modal="false"
      title="新增用户"
      width="500"
      :before-close="handleClose"
    >
      具体操作待讨论
    </el-dialog>
  </div>
</template>

<script setup>
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
</script>

<style lang="scss" scoped>
.add-user-dialog {
}
</style>
