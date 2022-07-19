<template>
  <div class="body">
    <HistoricalProjectedChart :svgId="'test-hp-chart'" :data="data" :width="378" :height="270" :dark="dark" />
    <!-- <HistoricalProjectedChart :data="data" :width="1000" :height="600" /> -->

    <div class="right">
      <div class="days">
        <button v-on:click="handleClick1W">1W</button>
        <button v-on:click="handleClick1M">1M</button>
        <button v-on:click="handleClick3M">3M</button>
        <button v-on:click="handleClick1Y">1Y</button>
        <button v-on:click="handleClickTest">Test</button>
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

      <button @click="handleChangeMode">Change Mode</button>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { randomRange, abridgeNumber } from "./utils/utils";
import HistoricalProjectedChart from "./components/HistoricalProjectedChart.vue";

export default {
  data() {
    return {
      data: {
        historical: [
          { date: dayjs("2022-06-01"), value: 0 },
          { date: dayjs("2022-06-02"), value: 0 },
          { date: dayjs("2022-06-03"), value: 0 },
          { date: dayjs("2022-06-04"), value: 0 },
          { date: dayjs("2022-06-05"), value: 0 },
          { date: dayjs("2022-06-06"), value: 0 },
          { date: dayjs("2022-06-07"), value: 0 },
        ],
        today: { date: dayjs("2022-06-08"), value: 0.0111 },
        projectedCurrent: [
          { date: dayjs("2022-06-09"), value: 0.0115 },
          { date: dayjs("2022-06-10"), value: 0.0125 },
          { date: dayjs("2022-06-11"), value: 0.0135 },
          { date: dayjs("2022-06-12"), value: 0.0155 },
          { date: dayjs("2022-06-13"), value: 0.0165 },
          { date: dayjs("2022-06-14"), value: 0.0175 },
          { date: dayjs("2022-06-15"), value: 0.0195 },
        ],
        projectedPotential: [
          { date: dayjs("2022-06-09"), value: 0.0135 },
          { date: dayjs("2022-06-10"), value: 0.0145 },
          { date: dayjs("2022-06-11"), value: 0.0165 },
          { date: dayjs("2022-06-12"), value: 0.0185 },
          { date: dayjs("2022-06-13"), value: 0.0195 },
          { date: dayjs("2022-06-14"), value: 0.0215 },
          { date: dayjs("2022-06-15"), value: 0.0245 },
        ],
      },
      startValue: 1000,
      todayValue: 10000,
      lastValuePC: 20000,
      lastValuePP: 30000,
      dark: false,
    };
  },
  mounted() {
    this.fillData(7);

    this.abridge(0);
    this.abridge(100);
    this.abridge(12345);
    this.abridge(123456);
    this.abridge(12345678);
    this.abridge(0.1);
    this.abridge(0.1234567);
  },
  methods: {
    abridge(num) {
      console.log(num, abridgeNumber(num));
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
    handleClickTest() {
      this.data = {
        historical: [
          { date: dayjs("2022-06-01"), value: 0 },
          { date: dayjs("2022-06-02"), value: 0 },
          { date: dayjs("2022-06-03"), value: 0 },
          { date: dayjs("2022-06-04"), value: 0 },
          { date: dayjs("2022-06-05"), value: 0 },
          { date: dayjs("2022-06-06"), value: 0 },
          { date: dayjs("2022-06-07"), value: 0 },
        ],
        today: { date: dayjs("2022-06-08"), value: 0.06 },
        projectedCurrent: [
          { date: dayjs("2022-06-09"), value: 0.115 },
          { date: dayjs("2022-06-10"), value: 0.125 },
          { date: dayjs("2022-06-11"), value: 0.135 },
          { date: dayjs("2022-06-12"), value: 0.155 },
          { date: dayjs("2022-06-13"), value: 0.165 },
          { date: dayjs("2022-06-14"), value: 0.175 },
          { date: dayjs("2022-06-15"), value: 0.195 },
        ],
        projectedPotential: [
          { date: dayjs("2022-06-09"), value: 0.32 },
          { date: dayjs("2022-06-10"), value: 0.48 },
          { date: dayjs("2022-06-11"), value: 0.64 },
          { date: dayjs("2022-06-12"), value: 0.8 },
          { date: dayjs("2022-06-13"), value: 0.96 },
          { date: dayjs("2022-06-14"), value: 1.12 },
          { date: dayjs("2022-06-15"), value: 1.34 },
        ],
      };
    },

    handleChangeMode() {
      this.dark = !this.dark;
    },

    fillData(length) {
      const today = dayjs(dayjs().format("YYYY-MM-DD"));
      const startValue = Number(this.startValue);
      const todayValue = Number(this.todayValue);
      const lastValuePC = Number(this.lastValuePC);
      const lastValuePP = Number(this.lastValuePP);
      // console.log(today, today.subtract(7, "day").format("YYYY-MM-DD"));

      // historical
      const historical = [{ date: today.subtract(length, "day"), value: startValue }];
      let stepH = (todayValue - startValue) / length;
      let preValue = Number(startValue);
      let wave = (length * 2) / 7;

      for (let i = 0; i < length; i++) {
        let value = startValue + stepH * (i - 1) + stepH * randomRange(-wave, wave);
        value = value <= todayValue ? value : todayValue;
        value = value >= preValue ? value : preValue;
        historical.push({ date: today.add(i - length, "day"), value });

        preValue = value;
      }

      // projected
      const projectedCurrent = [];
      const projectedPotential = [];
      const stepPC = (lastValuePC - todayValue) / length;
      const stepPP = (lastValuePP - todayValue) / length;
      let preValuePC = todayValue;
      let preValuePP = todayValue;

      for (let i = 1; i <= length; i++) {
        let valuePC = todayValue + stepPC * (i - 1) + stepPC * randomRange(-wave, wave);
        valuePC = valuePC >= preValuePC ? valuePC : preValuePC;
        projectedCurrent.push({ date: today.add(i, "day"), value: valuePC });
        preValuePC = valuePC;

        const valuePP = Math.max(preValuePP, valuePC, todayValue + stepPP * (i + 1)) + stepPC * randomRange(-wave, wave);
        // let valuePP = Math.max(
        //   preValuePP + stepPC * randomRange(0, wave),
        //   valuePC + stepPC * randomRange(-wave, wave),
        //   todayValue + stepPP * (i + 1) + stepPC * randomRange(-wave, wave)
        // );
        // if (valuePP > todayValue + stepPP * (i + 4)) valuePP = todayValue + stepPP * (i + 4);
        projectedPotential.push({ date: today.add(i, "day"), value: valuePP });
        preValuePP = valuePP;
      }

      this.data = { historical, today: { date: today, value: todayValue }, projectedCurrent, projectedPotential };
    },
  },
  components: { HistoricalProjectedChart },
};
</script>

<style lang="less" scoped>
.body {
  display: flex;

  .right {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .days {
      display: flex;
      flex-direction: row;
    }

    .days button {
      width: 60px;
    }

    .values div {
      width: 400px;
    }

    button {
      width: 100px;
    }
  }
}
</style>
