<template>
  <div class="comp">
    <div class="progress-box">
      default
      <claude-ring-chart :percentage="rate" :animation-duration="1000" :thickness="10"></claude-ring-chart>
    </div>
    <div class="progress-box">
      custom
      <claude-ring-chart :percentage="rate" :on-tween="v => (realtimeRate = v)" :animation-duration="1000" ring-color="#55aa00" bg-ring-color="#99ee55" :corner-radius="0" :thickness="30">
        <div style="display: flex; flex-direction: column; font-size: 16px; font-weight: bold; color: goldenrod">
          <span>{{ `${(realtimeRate * 100).toFixed(2)}%` }}</span>
          <span>Est.</span>
        </div>
      </claude-ring-chart>
    </div>
    <div class="button-list">
      <button @click="() => (rate = 0)">0%</button>
      <button @click="() => (rate = 0.01)">1%</button>
      <button @click="handleRandom" style="height: 2em">random ({{ rate.toFixed(6) }})</button>
      <button @click="() => (rate = 0.9999)">99.99%</button>
      <button @click="() => (rate = 1)">100%</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import ClaudeRingChart from "./components/MechanismRing3Chart.vue";
const rate = ref<number>(0.75); // 初始化 rate[0] 为 0.75 (75%)
const realtimeRate = ref(0);
const timer = ref(0);

onMounted(() => {
  // timer.value = setInterval(() => {
  //   console.log("New rate value:", rate.value, "which is", (rate.value * 100).toFixed(2) + "%");
  // }, 2000);
  rate.value = Math.random();
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer.value);
  }
});

const handleRandom = () => {
  rate.value = Math.random();
};
</script>

<style lang="less" scoped>
.comp {
  display: flex;

  .progress-box {
    width: 100px;
    padding: 10px;
  }

  .button-list {
    display: flex;
    flex-direction: column;
    width: 140px;
  }

  button {
    padding: 2px 0;
    margin: 1px 0;
  }
}
</style>
