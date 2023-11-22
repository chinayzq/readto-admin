<template>
  <div class="app-container">
    <el-tabs v-model="activeName" v-if="!ip">
      <el-tab-pane label="电子钱包" name="first">
        <PackageOrCard tabType="package" />
      </el-tab-pane>
      <el-tab-pane label="银行卡" name="second">
        <PackageOrCard tabType="card" />
      </el-tab-pane>
      <el-tab-pane label="话费充值" name="third">
        <PhoneCharge />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PackageOrCard from './components/packageOrCard.vue'
import PhoneCharge from './components/phoneCharge.vue'
const activeName = ref('first')
</script>

<style scoped></style>
