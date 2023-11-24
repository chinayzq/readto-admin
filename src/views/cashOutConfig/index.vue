<template>
  <div class="app-container">
    <el-tabs v-model="activeName" v-if="!ip">
      <el-tab-pane label="电子钱包" name="first">
        <PackageOrCard v-if="activeName === 'first'" accountType="1" />
      </el-tab-pane>
      <el-tab-pane label="银行卡" name="second">
        <PackageOrCard v-if="activeName === 'second'" accountType="2" />
      </el-tab-pane>
      <el-tab-pane label="话费充值" name="third">
        <PhoneCharge v-if="activeName === 'third'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
// accountType: 1：电子钱包，2：银行卡，3：话费
import { ref } from 'vue'
import PackageOrCard from './components/packageOrCard.vue'
import PhoneCharge from './components/phoneCharge.vue'
const activeName = ref('first')
</script>

<style scoped></style>
