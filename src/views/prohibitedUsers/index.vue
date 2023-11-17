<template>
  <div class="app-container prohibited-user-management">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="IP封禁" name="first">
        <IPBlocking />
      </el-tab-pane>
      <el-tab-pane label="黑名单" name="second">
        <BlackList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from "vue"
import IPBlocking from "./components/IPBlocking.vue"
import BlackList from "./components/BlackList.vue"

const activeName = ref("first")
</script>
<style scoped lang="scss">
.prohibited-user-management {
  padding-top: 5px;
}
</style>
