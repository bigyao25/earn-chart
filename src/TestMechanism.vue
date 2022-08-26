<template>
  <div class="body">
    <MechanismChart :data="data" :selected="selected" @axis-x-click="axisXClick" :width="378" :height="270" :dark="dark" />

    <div class="right">
      <button @click="handleChange">Change Data</button>
      <span>Selected Tick: {{ selected }}</span>
      <button @click="handleChangeMode">Change Mode</button>
      <button @click="handleChangeSelect">Change Select</button>
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
      data: [
        {
          apys: [
            { tier: { min: 0, max: 100 }, apy: 0.1 },
            { tier: { min: 100, max: 1000 }, apy: 0.2 },
          ],
          compound: false,
          color: "#6884DC",
        },
        {
          apys: [
            { tier: { min: 0, max: 100 }, apy: 0.1 },
            { tier: { min: 100, max: 1000 }, apy: 0.2 },
            { tier: { min: 1000, max: Number.MAX_VALUE }, apy: 0.5 },
          ],
          compound: true,
          color: "#925BCA",
        },
        {
          apys: [{ tier: { min: 0, max: Number.MAX_VALUE }, apy: 0.05 }],
          compound: false,
          color: "#EEAD00",
        },
      ],
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
      const data = [];

      const radomRgbColor = () => {
        //随机生成RGB颜色
        const arr = [];
        for (let i = 0; i < 3; i++) {
          // 暖色
          // arr.push(Math.floor(Math.random() * 128 + 64));
          // 亮色
          arr.push(Math.floor(Math.random() * 128 + 128));
        }
        const [r, g, b] = arr;
        // rgb颜色
        // var color=`rgb(${r},${g},${b})`;
        // 16进制颜色
        const color = `#${r.toString(16).length > 1 ? r.toString(16) : "0" + r.toString(16)}${g.toString(16).length > 1 ? g.toString(16) : "0" + g.toString(16)}${
          b.toString(16).length > 1 ? b.toString(16) : "0" + b.toString(16)
        }`;
        return color;
      };

      const fill = () => {
        let generator = {
          apys: [],
          compound: Math.random() > 0.5,
          color: radomRgbColor(),
        };
        let apy = randomRange(0, 0.3);
        generator.apys.push({ tier: { min: 0, max: 100 }, apy });
        apy = randomRange(apy, 1);
        generator.apys.push({ tier: { min: 0, max: 1000 }, apy });
        apy = randomRange(apy, 1);
        generator.apys.push({ tier: { min: 0, max: Number.MAX_VALUE }, apy });
        return generator;
      };

      // if (Math.random() <= 0.8) {
      //   data.defi = fill();
      // }
      // if (Math.random() <= 0.8) {
      //   data.staking = fill();
      // }
      // if (Math.random() <= 0.8) {
      //   data.liquid = fill();
      // }

      // if (!data.defi && !data.staking && !data.liquid) {
      //   data.staking = fill();
      // }

      const count = randomRange(0, 10);
      for (let i = 0; i < count; i++) {
        data.push(fill());
      }

      this.data = data;
    },
    handleChangeMode() {
      this.dark = !this.dark;
    },
    handleChangeSelect() {
      this.selected = (this.selected % 4) + 1;
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
