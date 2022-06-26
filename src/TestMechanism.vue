<template>
  <MechanismChart :apys="apys" :selected="selected" @axis-x-click="axisXClick" :width="378" :height="270" />

  <button @click="handleChange">Change Data</button>
  <span>Selected Tick: {{ selected }}</span>
</template>

<script>
import dayjs from "dayjs";
import { randomRange } from "./utils/utils";
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
    };
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
      console.log("test", this.apys);
    },
  },
  components: { MechanismChart },
};
</script>

<style></style>
