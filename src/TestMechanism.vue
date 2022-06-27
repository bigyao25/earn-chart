<template>
  <div class="body">
    <MechanismChart :data="data" :selected="selected" @axis-x-click="axisXClick" :width="378" :height="270" :dark="dark" />

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
import { randomRange } from "./utils/utils";

export default {
  data() {
    return {
      data: {
        defi: {
          apys: [
            { tier: { min: 0, max: 100 }, apy: 0.1 },
            { tier: { min: 100, max: 1000 }, apy: 0.2 },
          ],
          compound: false,
        },
        staking: {
          apys: [
            { tier: { min: 0, max: 100 }, apy: 0.1 },
            { tier: { min: 100, max: 1000 }, apy: 0.2 },
            { tier: { min: 1000, max: Number.MAX_VALUE }, apy: 0.5 },
          ],
          compound: true,
        },
        liquid: {
          apys: [{ tier: { min: 0, max: Number.MAX_VALUE }, apy: 0.05 }],
          compound: false,
        },
      },
      selected: 2,
      dark: false,
    };
  },
  mounted() {
    const tieredApy = [
      { tier: { min: 0, max: 100 }, apy: 0.1 },
      { tier: { min: 100, max: 1000 }, apy: 0.2 },
      { tier: { min: 1000, max: Number.MAX_VALUE }, apy: 0.5 },
    ];
  },
  methods: {
    axisXClick(selected) {
      this.selected = selected;
    },
    handleChange() {
      const data = {};

      const fill = () => {
        let generator = {
          apys: [],
          compound: Math.random() > 0.5,
        };
        let apy = randomRange(0, 0.3);
        generator.apys.push({ tier: { min: 0, max: 100 }, apy });
        apy = randomRange(apy, 1);
        generator.apys.push({ tier: { min: 0, max: 1000 }, apy });
        apy = randomRange(apy, 1);
        generator.apys.push({ tier: { min: 0, max: Number.MAX_VALUE }, apy });
        return generator;
      };

      if (Math.random() <= 0.8) {
        data.defi = fill();
      }
      if (Math.random() <= 0.8) {
        data.staking = fill();
      }
      if (Math.random() <= 0.8) {
        data.liquid = fill();
      }

      if (!data.defi && !data.staking && !data.liquid) {
        data.staking = fill();
      }

      this.data = data;
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
