<template>
  <div class="body">
    <MechanismRingChart :svg-id="'test-mr-chart'" :data="data" :width="89" :height="89" :dark="dark" />

    <div class="right">
      <button @click="handleStyle1">Style 1</button>
      <button @click="handleStyle2">Style 2</button>
      <button @click="handleStyle3">Style 3</button>
      <button @click="handleStyle4">Style 4</button>
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
          { range: { min: 0, max: 0.75 }, color: "#925BCA" },
          { range: { min: 0.75, max: 1 }, color: "#DDDCEA" },
        ],
        info: { text: 0.75, color: "#925BCA" },
        defaultColor: "#DDDCEA",
      },
      selected: 2,
      dark: false,
    };
  },
  methods: {
    handleStyle1() {
      this.data = {
        ranges: [
          { range: { min: 0, max: 0.75 }, color: "#925BCA" },
          { range: { min: 0.75, max: 1 }, color: "#DDDCEA" },
        ],
        info: { text: 0.75, color: "#925BCA" },
        defaultColor: "#DDDCEA",
      };
    },
    handleStyle2() {
      this.data = {
        ranges: [
          { range: { min: 0, max: 0.75 }, color: "#DDDCEA" },
          { range: { min: 0.75, max: 1 }, color: "#6E87D7" },
        ],
        info: { text: 0.25, color: "#6E87D7" },
        defaultColor: "#DDDCEA",
      };
    },
    handleStyle3() {
      this.data = {
        ranges: [{ range: { min: 0, max: 1 }, color: "#EEAD00" }],
        info: { text: 1, color: "#EEAD00" },
        defaultColor: "#DDDCEA",
      };
    },
    handleStyle4() {
      this.data = {
        ranges: [
          { range: { min: 0, max: 0.75 }, color: "#925BCA" },
          { range: { min: 0.75, max: 1 }, color: "#6E87D7" },
        ],
        defaultColor: "#DDDCEA",
      };
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
