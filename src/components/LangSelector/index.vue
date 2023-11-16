<template>
  <el-select v-model="lang" placeholder="语言" @change="changeHandler">
    <el-option v-for="item in langOptions" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup>
import { ref } from "vue"
const lang = ref("zh")
// zh（中文），en（英文），id（印尼），ph（菲律宾）
const langOptions = ref([
  {
    value: "zh",
    label: "中文"
  },
  {
    value: "en",
    label: "英文"
  },
  {
    value: "id",
    label: "印尼"
  },
  {
    value: "ph",
    label: "菲律宾"
  }
])

const emit = defineEmits(["change"])
const changeHandler = (value) => {
  emit("change", value)
}
emit("change", lang.value)
</script>

<style></style>
