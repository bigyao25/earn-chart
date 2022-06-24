<template>
  <div class="chart relative">
    <svg id="_mechanism_chart" :height="height" :width="width"></svg>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { select } from "d3-selection";
import { scaleUtc, scaleLinear } from "d3-scale";
import { line, curveLinear, curveBasis, stack, area } from "d3-shape";
import { axisBottom, axisRight } from "d3-axis";
import "d3-transition";
import { Decimal } from "decimal.js";

export default {
  props: {
    height: { type: Number, default: 400 },
    width: { type: Number, default: 500 },
    apys: Object,
  },

  data() {
    return {
      widthes: {
        axisDot: 2.5, // 坐标轴顶点半径
        axisLineThickness: 1,
        xTickeValueArea: 30, // x轴标尺文字高度
        yTickeValueArea: 30, // y轴标尺文字高度
        tickeValueFontSize: 12, // 标尺文字大小
        tickeValueFontWeight: 400,
        tickeValueFontWeightBold: 700,
        // tipWidth: 80,
        // tipHeight: 60,
      },
      colors: {
        staking: "#925BCA",
      },
      chartArea: {},
      dataDefi: [],
      dataStaking: [],
      dataLiquid: [],
      xScale: {},
      yScaleDefi: {},
      yScaleStaking: {},
      yScaleLiquid: {},
      xAxis: {},
      yAxis: {},
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.fillData();
      this.initChart();
      this.initScale();

      const svg = select("#_mechanism_chart");
      svg.selectAll("*").remove();

      svg.attr("viewBox", [0, 0, this.width, this.height]).attr("style", "max-width: 100%; height: auto; height: intrinsic;").attr("font-family", "Mulish Bold").attr("font-size", 14);
      // .on("touchstart", event => event.preventDefault())
      // .on("pointermove", pointermoved);

      // axis
      svg
        .append("g")
        .attr("transform", `translate(0, ${this.widthes.axisDot + this.chartArea.size.height})`)
        .call(this.xAxis);
      svg
        .append("g")
        .attr("transform", `translate(${this.widthes.axisDot + this.chartArea.size.width}, 0)`)
        .call(this.yAxis);

      const lineStaking = line()
        .curve(curveBasis)
        .x(d => this.xScale(d.date))
        .y(d => this.yScaleStaking(d.value));

      svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", this.colors.staking)
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", 1)
        .attr("d", lineStaking(this.dataStaking));
    },

    fillData() {
      this.dataStaking = [
        { date: 0, value: 1 },
        { date: 1, value: Math.pow(1 + this.apys.staking, 1) },
        { date: 2, value: Math.pow(1 + this.apys.staking, 2) },
        { date: 3, value: Math.pow(1 + this.apys.staking, 3) },
        { date: 4, value: Math.pow(1 + this.apys.staking, 4) },
      ];
    },

    initChart() {
      this.chartArea = {
        bottomLeft: { x: this.widthes.axisDot, y: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot },
        size: {
          width: this.width - this.widthes.axisDot - this.widthes.axisDot,
          height: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot - this.widthes.axisDot,
        },
      };
    },

    initScale() {
      this.xScale = scaleLinear()
        .domain([this.dataStaking[0].date, this.dataStaking[this.dataStaking.length - 1].date])
        .range([this.chartArea.bottomLeft.x, this.widthes.axisDot + this.chartArea.size.width]);
      this.yScaleStaking = scaleLinear()
        .domain([this.dataStaking[0].value, this.dataStaking[this.dataStaking.length - 1].value])
        .range([this.chartArea.bottomLeft.y, this.widthes.axisDot]);

      this.xAxis = axisBottom(this.xScale).ticks(4, null).tickSizeOuter(0);
      this.yAxis = axisRight(this.yScaleStaking).ticks(0, "");
    },
  },
};
</script>

<style scoped></style>
