<template>
  <div class="container">
    <div class="card bg-red">
      <TestMechanism />
    </div>
    <div class="card bg-green">
      <TestHistoricalProjected />
    </div>
    <div class="card bg-blue">
      <TestInvest></TestInvest>
    </div>
    <div class="card bg-yellow"><TestMechanismRing></TestMechanismRing></div>
    <div class="card bg-yellow"><TestMechanismRing2></TestMechanismRing2></div>
    <div class="card bg-red">
      <TestMyRingChart></TestMyRingChart>
    </div>
    <div class="card bg-gray">
      <Test1></Test1>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TestHistoricalProjected from "./TestHistoricalProjected.vue";
import TestMechanism from "./TestMechanism.vue";
import TestMechanismRing from "./TestMechanismRing.vue";
import TestMechanismRing2 from "./TestMechanismRing2.vue";
import TestInvest from "./TestInvest.vue";
import TestMyRingChart from "./TestMyRingChart.vue";
import Test1 from "./components/Test1.vue";

export default {
  data() {
    return {};
  },
  mounted() {
    let a = 0;
    console.log(a ?? 1);
  },
  methods: {},
  components: { TestHistoricalProjected, TestMechanism, TestMechanismRing, TestMechanismRing2, TestInvest, TestMyRingChart, Test1 },
};
</script>

<style lang="less" scoped>
/* mulish -latin */
// @font-face {
//   font-family: "Mulish";
//   font-style: normal;
//   font-weight: normal;
//   font-display: swap;
//   src: url(/fonts/mulish-v7-latin-regular.woff?t=1641532682023) format("woff"), url(./fonts/mulish-v7-latin-regular.woff2?t=1641532682023) format("woff2");
// }

/* mulish-regular -latin */
@font-face {
  font-family: "Mulish Regular";
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url(/fonts/mulish-v7-latin-regular.woff?t=1641532682023) format("woff"), url(./fonts/mulish-v7-latin-regular.woff2?t=1641532682023) format("woff2");
}

/* mulish-medium -latin */
@font-face {
  font-family: "Mulish Medium";
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url(/fonts/mulish-v7-latin-500.woff?t=1641532682023) format("woff"), url(./fonts/mulish-v7-latin-500.woff2?t=1641532682023) format("woff2");
}

/* mulish-semibold -latin */
@font-face {
  font-family: "Mulish Semibold";
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url(/fonts/mulish-v7-latin-600.woff?t=1641532682023) format("woff"), url(./fonts/mulish-v7-latin-600.woff2?t=1641532682023) format("woff2");
}

/* mulish-bold -latin */
@font-face {
  font-family: "Mulish Bold";
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url(/fonts/mulish-v7-latin-700.woff?t=1641532682023) format("woff"), url(./fonts/mulish-v7-latin-700.woff2?t=1641532682023) format("woff2");
}

.container {
  display: flex;
  flex-direction: column;

  .card {
    display: flex;
    margin: 5px;
    padding: 5px;
  }

  .bg-red {
    background-color: rgba(255, 0, 0, 0.1);
  }

  .bg-green {
    background-color: rgba(0, 255, 0, 0.1);
  }

  .bg-blue {
    background-color: rgba(0, 0, 255, 0.1);
  }

  .bg-yellow {
    background-color: rgba(255, 255, 0, 0);
  }

  .bg-gray {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
