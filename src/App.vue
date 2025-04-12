<template>
  <div class="container">
    <div class="card bg-red">
      <div class="title">MechanismChart</div>
      <div class="content"><TestMechanism /></div>
    </div>
    <div class="card bg-green">
      <div class="title">HistoricalProjectedChart</div>
      <TestHistoricalProjected />
    </div>
    <div class="card bg-blue">
      <div class="title">Invest</div>
      <div class="content">
        <TestInvest />
      </div>
    </div>
    <div class="card bg-yellow">
      <div class="title">MechanismRing (线上在用) / MechanismRing2 (未完成)</div>
      <div class="content">
        <TestMechanismRing />
        <TestMechanismRing2 />
      </div>
    </div>
    <div class="card bg-red">
      <div class="title">MyRingChart</div>
      <div class="content">
        <TestMyRingChart />
      </div>
    </div>
    <div class="card">
      <div class="title">MechanismRing3 (新版还没上线，自测没问题)</div>
      <div class="content">
        <TestClaudeRingChart />
      </div>
    </div>
    <div class="card bg-gray">
      <div class="title">Test1</div>
      <div class="content">
        <Test1 />
      </div>
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
import TestClaudeRingChart from "./TestMechanismRing3.vue";

export default {
  data() {
    return {};
  },
  mounted() {
    let a = 0;
    console.log(a ?? 1);
  },
  methods: {},
  components: { TestHistoricalProjected, TestMechanism, TestMechanismRing, TestMechanismRing2, TestInvest, TestMyRingChart, TestClaudeRingChart, Test1 },
};
</script>

<style lang="less">
:root {
  --border-color: gray;

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

  * {
    font-family: "Mulish Regular";
  }
}
</style>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  // --border-color: red;

  .card {
    display: flex;
    flex-direction: column;
    margin: 5px;
    border: 1px solid var(--border-color);

    .title {
      line-height: 2em;
      background-color: gainsboro;
      padding: 5px;
      border-bottom: 1px solid var(--border-color);
    }

    .content {
      display: flex;
      flex-direction: row;
      padding: 10px;
      gap: 10px;
    }
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
    background-color: rgba(255, 255, 0, 0.1);
  }

  .bg-gray {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
