<template>
  <div>
    <HistoricalProjectedChart :data="data" :width="400" :height="220" />
    <!-- <HistoricalProjectedChart :data="this.choose === 1 ? data1 : data2" :width="1000" :height="600" /> -->

    <div class="days">
      <button v-on:click="handleClick1W">1W</button>
      <button v-on:click="handleClick1M">1M</button>
      <button v-on:click="handleClick3M">3M</button>
      <button v-on:click="handleClick1Y">1Y</button>
    </div>

    <div class="values">
      <div>
        start value:
        <input type="text" v-model="startValue" />
      </div>
      <div>
        today value:
        <input type="text" v-model="todayValue" />
      </div>
      <div>
        last project current value:
        <input type="text" v-model="lastValuePC" />
      </div>
      <div>
        last project potential value:
        <input type="text" v-model="lastValuePP" />
      </div>
    </div>

    <Test1></Test1>
  </div>
</template>

<script>
import dayjs from "dayjs";
import HistoricalProjectedChart from "./components/HistoricalProjectedChart.vue";
import Test1 from "./components/Test1.vue";

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
      choose: 1,
      startValue: 10,
      todayValue: 100,
      lastValuePC: 200,
      lastValuePP: 300,
    };
  },
  mounted() {
    this.fillData(7);
  },
  methods: {
    handleClick() {
      this.choose = this.choose === 1 ? 2 : 1;
    },
    handleClick1W() {
      this.fillData(7);
    },
    handleClick1M() {
      this.fillData(30);
    },
    handleClick3M() {
      this.fillData(90);
    },
    handleClick1Y() {
      this.fillData(365);
    },

    fillData(length) {
      const today = dayjs(dayjs().format("YYYY-MM-DD"));
      // console.log(today, today.subtract(7, "day").format("YYYY-MM-DD"));

      // historical
      const historical = [{ date: today.subtract(length, "day"), value: this.startValue }];
      let stepH = (this.todayValue - this.startValue) / length;
      let preValue = this.startValue;
      let wave = (length * 2) / 7;

      for (let i = 0; i < length; i++) {
        let value = this.startValue + stepH * (i - 1) + stepH * this.randomRange(-wave, wave);
        value = value <= this.todayValue ? value : this.todayValue;
        value = value >= preValue ? value : preValue;
        historical.push({ date: today.add(i - length, "day"), value });

        preValue = value;
      }
      console.log(historical);

      // projected
      const projectedCurrent = [];
      const projectedPotential = [];
      const stepPC = (this.lastValuePC - this.todayValue) / length;
      const stepPP = (this.lastValuePP - this.todayValue) / length;
      let preValuePC = this.todayValue;
      let preValuePP = this.todayValue;

      for (let i = 1; i <= length; i++) {
        let valuePC = this.todayValue + stepPC * (i - 1) + stepPC * this.randomRange(-wave, wave);
        valuePC = valuePC >= preValuePC ? valuePC : preValuePC;
        projectedCurrent.push({ date: today.add(i, "day"), value: valuePC });
        preValuePC = valuePC;

        const valuePP = Math.max(preValuePP, valuePC, this.todayValue + stepPP * (i + 1)) + stepPC * this.randomRange(-wave, wave);
        // let valuePP = Math.max(
        //   preValuePP + stepPC * this.randomRange(0, wave),
        //   valuePC + stepPC * this.randomRange(-wave, wave),
        //   this.todayValue + stepPP * (i + 1) + stepPC * this.randomRange(-wave, wave)
        // );
        // if (valuePP > this.todayValue + stepPP * (i + 4)) valuePP = this.todayValue + stepPP * (i + 4);
        projectedPotential.push({ date: today.add(i, "day"), value: valuePP });
        preValuePP = valuePP;
      }

      this.data = { historical, today: { date: today, value: this.todayValue }, projectedCurrent, projectedPotential };
    },

    randomRange(Min, Max) {
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.round(Rand * Range); //四舍五入
      return num;
    },
  },
  components: { HistoricalProjectedChart, Test1 },
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

.days {
  display: flex;
  flex-direction: row;
  width: 100vw;
}

.days button {
  width: 60px;
}

.values div {
  width: 400px;
}
</style>
