<template>
  <div class="body">
    <MechanismRingChart :data="data" :width="378" :height="270" :dark="dark" />

    <div class="right">
      <button @click="handleChange">Change Data</button>
      <button @click="handleChangeMode">Change Mode</button>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import MechanismRingChart from "./components/MechanismRingChart.vue";
import { randomRange } from "./utils/utils";

export default {
  data() {
    return {
      data: {
        ranges: [
          { range: { min: 0, max: 0.75 }, color: "purple" },
          { range: { min: 0.75, max: 1 }, color: "gray" },
        ],
        text: "75%",
      },
      selected: 2,
      dark: false,
    };
  },
  methods: {
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
  components: { MechanismRingChart },
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
