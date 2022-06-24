<template>
  <MechanismChart :apys="apys" :width="400" :height="220" />
</template>

<script>
import dayjs from "dayjs";
import MechanismChart from "./components/MechanismChart.vue";

export default {
  data() {
    return {
      apys: {
        defi: 0.9,
        staking: 0.3,
        liquid: 0.04,
      },
    };
  },
  components: { MechanismChart },
};
</script>

<style></style>
