<template>
  <HistoricalProjectedChart :data="data" :width="1000" :height="600" />
</template>

<script>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import dayjs from "dayjs";
import HistoricalProjectedChart from "./components/HistoricalProjectedChart.vue";

export default {
  data() {
    return {
      data: {
        historical: [
          { date: dayjs("2022-06-01"), value: 57 },
          { date: dayjs("2022-06-02"), value: 65 },
          { date: dayjs("2022-06-03"), value: 75 },
          { date: dayjs("2022-06-04"), value: 81 },
          { date: dayjs("2022-06-05"), value: 86 },
          { date: dayjs("2022-06-06"), value: 90 },
          { date: dayjs("2022-06-07"), value: 95 },
        ],
        today: { date: dayjs("2022-06-08"), value: 100 },
        projected: [
          { date: dayjs("2022-06-09"), value: 115 },
          { date: dayjs("2022-06-10"), value: 125 },
          { date: dayjs("2022-06-11"), value: 135 },
          { date: dayjs("2022-06-12"), value: 155 },
          { date: dayjs("2022-06-13"), value: 165 },
          { date: dayjs("2022-06-14"), value: 175 },
          { date: dayjs("2022-06-15"), value: 195 },
        ],
      },
    };
  },
  components: { HistoricalProjectedChart },
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
</style>
