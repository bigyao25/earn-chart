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
import { randomRange, getRewardOneDay, getProfitByApy } from "./utils/utils";
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
      { tiered: { start: 0, end: 100 }, apy: 0.1 },
      { tiered: { start: 100, end: 1000 }, apy: 0.2 },
      { tiered: { start: 1000, end: Number.MAX_VALUE }, apy: 0.5 },
    ];
    console.log(`1day-reward-1`, getRewardOneDay(1, tieredApy));
    console.log(`1day-reward-10000`, getRewardOneDay(10000, tieredApy));
    console.log(`profit-1*1`, getProfitByApy({ principal: 1, apyTiers: tieredApy, compound: false, days: 1 }));
    console.log(`profit-1*365`, getProfitByApy({ principal: 1, apyTiers: tieredApy, compound: false, days: 365 }));
    console.log(`profit-1*365c`, getProfitByApy({ principal: 1, apyTiers: tieredApy, compound: true, days: 365 }));
    console.log(`profit-10000*1`, getProfitByApy({ principal: 10000, apyTiers: tieredApy, compound: false, days: 1 }));
    console.log(`profit-10000*365`, getProfitByApy({ principal: 10000, apyTiers: tieredApy, compound: false, days: 365 }));
    console.log(`profit-10000*365c`, getProfitByApy({ principal: 10000, apyTiers: tieredApy, compound: true, days: 365 }));
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
