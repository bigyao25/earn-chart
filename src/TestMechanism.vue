<template>
  <div class="body">
    <MechanismChart :apys="apys" :selected="selected" @axis-x-click="axisXClick" :width="378" :height="270" :dark="dark" />

    <div class="right">
      <button @click="handleChange">Change Data</button>
      <span>Selected Tick: {{ selected }}</span>
      <button @click="handleChangeMode">Change Mode</button>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import MechanismChart from "./components/MechanismChart.vue";

export default {
  data() {
    return {
      apys: {
        defi: 0.4,
        staking: 0.3,
        liquid: 0.04,
      },
      selected: 2,
      dark: false,
    };
  },
  mounted() {
    const tieredApy = [
      { tiered: { min: 0, max: 100 }, apy: 0.1 },
      { tiered: { min: 100, max: 1000 }, apy: 0.2 },
      { tiered: { min: 1000, max: Number.MAX_VALUE }, apy: 0.5 },
    ];
  },
  methods: {
    axisXClick(selected) {
      this.selected = selected;
    },
    handleChange() {
      const apys = {};
      if (Math.random() <= 0.8) {
        apys.defi = Math.random();
      }
      if (Math.random() <= 0.8) {
        apys.staking = Math.random();
      }
      if (Math.random() <= 0.8) {
        apys.liquid = Math.random();
      }

      if (!apys.defi && !apys.staking && !apys.liquid) {
        apys.staking = Math.random();
      }

      this.apys = apys;
    },
    handleChangeMode() {
      this.dark = !this.dark;
    },
  },
  components: { MechanismChart },
};
</script>

<style lang="less" scoped>
.body {
  display: flex;

  .right {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    button {
      width: 100px;
    }
  }
}
</style>
