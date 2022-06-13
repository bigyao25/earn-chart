<template>
  <HistoricalProjectedChart :data="this.choose === 1 ? data1 : data2" :width="400" :height="220" />
  <!-- <HistoricalProjectedChart :data="data" :width="1000" :height="600" /> -->

  <button v-on:click="handleClick">change data</button>
</template>

<script>
import dayjs from "dayjs";
import HistoricalProjectedChart from "./components/HistoricalProjectedChart.vue";

export default {
  data() {
    return {
      data1: {
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
        projectedCurrent: [
          { date: dayjs("2022-06-09"), value: 115 },
          { date: dayjs("2022-06-10"), value: 125 },
          { date: dayjs("2022-06-11"), value: 135 },
          { date: dayjs("2022-06-12"), value: 155 },
          { date: dayjs("2022-06-13"), value: 165 },
          { date: dayjs("2022-06-14"), value: 175 },
          { date: dayjs("2022-06-15"), value: 195 },
        ],
        projectedPotential: [
          { date: dayjs("2022-06-09"), value: 135 },
          { date: dayjs("2022-06-10"), value: 145 },
          { date: dayjs("2022-06-11"), value: 165 },
          { date: dayjs("2022-06-12"), value: 185 },
          { date: dayjs("2022-06-13"), value: 195 },
          { date: dayjs("2022-06-14"), value: 215 },
          { date: dayjs("2022-06-15"), value: 245 },
        ],
      },
      data2: {
        historical: [
          { date: dayjs("2022-06-01"), value: 157 },
          { date: dayjs("2022-06-02"), value: 165 },
          { date: dayjs("2022-06-03"), value: 175 },
          { date: dayjs("2022-06-04"), value: 181 },
          { date: dayjs("2022-06-05"), value: 186 },
          { date: dayjs("2022-06-06"), value: 190 },
          { date: dayjs("2022-06-07"), value: 195 },
        ],
        today: { date: dayjs("2022-06-08"), value: 200 },
        projectedCurrent: [
          { date: dayjs("2022-06-09"), value: 215 },
          { date: dayjs("2022-06-10"), value: 225 },
          { date: dayjs("2022-06-11"), value: 235 },
          { date: dayjs("2022-06-12"), value: 255 },
          { date: dayjs("2022-06-13"), value: 265 },
          { date: dayjs("2022-06-14"), value: 275 },
          { date: dayjs("2022-06-15"), value: 295 },
        ],
        projectedPotential: [
          { date: dayjs("2022-06-09"), value: 335 },
          { date: dayjs("2022-06-10"), value: 345 },
          { date: dayjs("2022-06-11"), value: 365 },
          { date: dayjs("2022-06-12"), value: 385 },
          { date: dayjs("2022-06-13"), value: 395 },
          { date: dayjs("2022-06-14"), value: 415 },
          { date: dayjs("2022-06-15"), value: 545 },
        ],
      },
      choose: 1,
    };
  },
  methods: {
    handleClick() {
      this.choose = this.choose === 1 ? 2 : 1;
    },
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
