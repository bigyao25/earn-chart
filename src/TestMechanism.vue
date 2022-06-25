<template>
  <MechanismChart :apys="apys" :selected="selected" @axis-x-click="axisXClick" :width="378" :height="270" />

  <span>selected tick: {{ selected }}</span>
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
    };
  },
  methods: {
    axisXClick(selected) {
      this.selected = selected;
    },
  },
  components: { MechanismChart },
};
</script>

<style></style>
