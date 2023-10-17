<template>
  <div class="screen_adapter" :style="style">
    <slot />
  </div>
</template>
<script>
export default {
  name: "screen-adapter-component",
  props: {
    width: {
      type: String,
      default: "1920",
    },
    height: {
      type: String,
      default: "960",
    },
  },
  data() {
    return {
      style: {
        width: this.width + "px",
        height: this.height + "px",
        transform: "scale(1) translate(-50%, -50%)",
      },
    };
  },
  mounted() {
    this.setScale();
    window.onresize = this.Debounce(this.setScale, 300);
  },
  methods: {
    Debounce: (fn, t) => {
      const delay = t || 500;
      let timer;
      return function () {
        const args = arguments;
        if (timer) {
          clearTimeout(timer);
        }
        const context = this;
        timer = setTimeout(() => {
          timer = null;
          fn.apply(context, args);
        }, delay);
      };
    },
    // 获取放大缩小比例
    getScale() {
      const w = window.innerWidth / this.width;
      const h = window.innerHeight / this.height;
      // 固定缩放
      // return w < h ? w : h
      // 拉升缩放
      return [w, h];
    },
    // 设置比例
    setScale() {
      // 固定缩放
      // this.style.transform = "scale(" + this.getScale() + ") translate(-50%, -50%)"
      // 拉升缩放
      // this.style.transform =
      //   "scale(" +
      //   this.getScale()[0] +
      //   "," +
      //   this.getScale()[1] +
      //   ") translate(-50%, -50%)";
      this.style.transform =
        "scale(" + this.getScale()[0] + "," + this.getScale()[1] + ")";
    },
  },
};
</script>
<style lang="less" scoped>
.screen_adapter {
  transform-origin: 0 0;
  transition: 0.1s;
  overflow: hidden;
  position: absolute;
  left: 0px;
  top: 0px;
  background: #f9f4f4;
}
</style>