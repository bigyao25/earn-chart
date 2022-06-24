<template>
  <div>
    <TestMechanism />
    <TestHistoricalProjected />
    <Test1></Test1>
  </div>
</template>

<script>
import dayjs from "dayjs";
import TestHistoricalProjected from "./TestHistoricalProjected.vue";
import TestMechanism from "./TestMechanism.vue";
import Test1 from "./components/Test1.vue";

export default {
  data() {
    return {};
  },
  methods: {},
  components: { TestHistoricalProjected, TestMechanism, Test1 },
};
</script>

<style>
/* mulish -latin */
@font-face {
  font-family: "Mulish";
  font-style: normal;
  font-weight: normal;
  font-display: swap;
  src: url(/fonts/mulish-v7-latin-regular.woff?t=1641532682023) format("woff"), url(./fonts/mulish-v7-latin-regular.woff2?t=1641532682023) format("woff2");
}

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

div {
  display: flex;
  flex-direction: column;
}
</style>
