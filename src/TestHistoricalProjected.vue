<template>
  <HistoricalProjectedChart :data="data" :width="400" :height="220" />
  <!-- <HistoricalProjectedChart :data="data" :width="1000" :height="600" /> -->

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
</template>

<script>
import dayjs from "dayjs";
import { randomRange } from "./utils/utils";
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
      startValue: 1000,
      todayValue: 10000,
      lastValuePC: 20000,
      lastValuePP: 30000,
    };
  },
  mounted() {
    this.fillData(7);
  },
  methods: {
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
        let value = this.startValue + stepH * (i - 1) + stepH * randomRange(-wave, wave);
        value = value <= this.todayValue ? value : this.todayValue;
        value = value >= preValue ? value : preValue;
        historical.push({ date: today.add(i - length, "day"), value });

        preValue = value;
      }

      // projected
      const projectedCurrent = [];
      const projectedPotential = [];
      const stepPC = (this.lastValuePC - this.todayValue) / length;
      const stepPP = (this.lastValuePP - this.todayValue) / length;
      let preValuePC = this.todayValue;
      let preValuePP = this.todayValue;

      for (let i = 1; i <= length; i++) {
        let valuePC = this.todayValue + stepPC * (i - 1) + stepPC * randomRange(-wave, wave);
        valuePC = valuePC >= preValuePC ? valuePC : preValuePC;
        projectedCurrent.push({ date: today.add(i, "day"), value: valuePC });
        preValuePC = valuePC;

        const valuePP = Math.max(preValuePP, valuePC, this.todayValue + stepPP * (i + 1)) + stepPC * randomRange(-wave, wave);
        // let valuePP = Math.max(
        //   preValuePP + stepPC * randomRange(0, wave),
        //   valuePC + stepPC * randomRange(-wave, wave),
        //   this.todayValue + stepPP * (i + 1) + stepPC * randomRange(-wave, wave)
        // );
        // if (valuePP > this.todayValue + stepPP * (i + 4)) valuePP = this.todayValue + stepPP * (i + 4);
        projectedPotential.push({ date: today.add(i, "day"), value: valuePP });
        preValuePP = valuePP;
      }

      this.data = { historical, today: { date: today, value: this.todayValue }, projectedCurrent, projectedPotential };
    },
  },
  components: { HistoricalProjectedChart },
};
</script>

<style scoped>
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
