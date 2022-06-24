<template>
  <MechanismChart :apys="apys" :selected="2" :width="378" :height="270" />
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
    };
  },
  components: { MechanismChart },
};
</script>

<style></style>
