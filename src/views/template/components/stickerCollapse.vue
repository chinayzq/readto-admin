<template>
  <div class="stiker-collapse-component" v-loading="stickerLoading">
    <el-collapse accordion @change="collapseChange">
      <el-collapse-item
        :name="item.id"
        v-for="item in stickerList"
        :key="item.id"
      >
        <template #title>
          <img class="sticker-title-img" v-lazy="item.stickerUrl" alt="" />
        </template>
        <div class="sticker-list-container">
          <span
            class="single-sticker"
            v-for="subItem in item.stickerChildlist"
            :key="subItem.url"
            @click="addStickerToGraph(subItem)"
          >
            <img v-lazy="subItem.url" alt="" />
          </span>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { getStickerList, getStickerDetails } from "@/api/sticker";
const emit = defineEmits();
const addStickerToGraph = ({ url }) => {
  emit("add", url);
};

onBeforeMount(() => {
  initStickerList();
});
const stickerLoading = ref(false);
const stickerList = ref([]);
const initStickerList = () => {
  stickerLoading.value = true;
  getStickerList({
    offset: 0,
    pageSize: 500,
  })
    .then((res) => {
      if (res.code === 200) {
        stickerList.value = res.data.sort((a, b) => a.id - b.id);
      } else {
        stickerList.value = [];
      }
    })
    .finally(() => {
      stickerLoading.value = false;
    });
};
const collapseChange = (index) => {
  getStickerDetails({
    id: index,
  })
    .then((res) => {
      stickerList.value.forEach((item) => {
        if (item.id === index) {
          item.stickerChildlist = res.data.stickerChildlist;
        }
      });
    })
    .finally(() => {});
};
</script>

<style lang="less" scoped>
.stiker-collapse-component {
  height: 100%;
  .sticker-title-img {
    height: 40px;
    width: 40px;
  }
  .sticker-list-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
    .single-sticker {
      width: 15%;
      display: inline-block;
      img {
        width: 100%;
      }
    }
  }
}
</style>