<template>
  <div class="app-container prohibited-user-management">
    <el-tabs v-model="activeName" class="demo-tabs" v-if="!ip">
      <el-tab-pane label="IP封禁" name="first">
        <IPBlocking @getBottomList="getBottomListHandler" />
      </el-tab-pane>
      <el-tab-pane label="黑名单" name="second">
        <BlackList />
      </el-tab-pane>
    </el-tabs>
    <div v-else>
      <el-button style="margin: 15px 0;" type="primary" @click="ip = null">返回IP封禁列表</el-button>
      <BlackList :ip="ip" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import IPBlocking from "./components/IPBlocking.vue"
import BlackList from "./components/BlackList.vue"

const activeName = ref("first")

const ip = ref(null)
const getBottomListHandler = (row) => {
  ip.value = row.ip
}
</script>
<style scoped lang="scss">
.prohibited-user-management {
  padding-top: 5px;
}
</style>
