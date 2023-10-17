<template>
  <div class="layout-container">
    <div class="left-part">
      <SiderBar />
    </div>
    <div class="right-part">
      <TopBar />
      <div class="main-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import SiderBar from "./components/siderBar.vue";
import TopBar from "./components/topBar.vue";
</script>

<style lang="less" scoped>
.layout-container {
  display: flex;
  height: 100%;
  width: 100%;
  .left-part {
    width: 190px;
    height: 100%;
  }
  .right-part {
    width: calc(100% - 190px);
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-container {
      flex: 1;
      margin: 20px;
      padding: 20px;
      background: #ffffff;
      border-radius: 10px;
      overflow: auto;
    }
  }
}
</style>