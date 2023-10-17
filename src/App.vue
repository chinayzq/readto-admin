<template>
  <!-- <screen-adapter> -->
  <router-view></router-view>
  <!-- </screen-adapter> -->
</template>

<script setup>
import ScreenAdapter from "@/views/layout/screenAdapter.vue";
// import Layout from "@/views/layout/index.vue";
</script>

<style lang="less" scoped>
#app {
  overflow: hidden;
}
</style>
