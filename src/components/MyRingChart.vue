<template>
  <div class="progress">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 400 400">
      <!-- 底部背景圆环 -->
      <circle cx="200" cy="200" :r="radius" :stroke="bgRingColor" :stroke-width="strokeWidth" fill="none" />
      <!-- 进度条圆环 -->
      <circle
        class="progress-bar"
        ref="progressbar"
        cx="200"
        cy="200"
        :r="radius"
        :stroke="ringColor"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-linecap="strokeLinecap"
        transform="rotate(-90, 200, 200)"
        :stroke-dasharray="strokeDasharray"
        :stroke-dashoffset="strokeDashoffset"
      />
    </svg>
    <!-- 中间描述文字 -->
    <div class="progress-desc" :style="{ color: ringColor }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Progress",
  props: {
    rate: {
      type: Number,
      default: 0,
    },
    bgRingColor: {
      type: String,
      default: "#ebeef5",
    },
    ringColor: {
      type: String,
      default: "#67C23A",
    },
    strokeLinecap: {
      type: String,
      default: "round",
    },
    strokeWidth: {
      type: Number,
      default: 20,
    },
  },
  computed: {
    radius() {
      return 200 - this.strokeWidth / 2;
    },
    strokeDasharray() {
      return 2 * Math.PI * this.radius;
    },
    strokeDashoffset() {
      let val = 0;
      let rate = this.rate;
      if (rate > 1) {
        rate = 1;
      } else if (rate < 0) {
        rate = 0;
      }
      if (this.strokeLinecap === "round") {
        val = 2 * Math.PI * this.radius * (1 - rate) + this.strokeWidth;
      } else {
        val = 2 * Math.PI * this.radius * (1 - rate);
      }
      return val;
    },
  },
};
</script>

<style scoped>
.progress {
  position: relative;
  width: 100%;
  height: 100%;
}
.progress-desc {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: "Mulish Bold";
  font-size: 24;
  text-align: center;
}
.progress-bar {
  transition: stroke-dashoffset 1s ease;
}
</style>
