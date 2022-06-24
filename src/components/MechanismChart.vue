<template>
  <div class="chart relative">
    <svg id="_mechanism_chart" :height="height" :width="width"></svg>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { select } from "d3-selection";
import { scaleUtc, scaleLinear } from "d3-scale";
import { line, curveLinear, curveBasis, curveCardinal, stack, area } from "d3-shape";
import { axisBottom, axisRight } from "d3-axis";
import "d3-transition";
import { Decimal } from "decimal.js";

export default {
  props: {
    height: { type: Number, default: 400 },
    width: { type: Number, default: 500 },
    apys: Object,
    selected: Number,
  },

  data() {
    return {
      widthes: {
        axisDot: 2.5, // 坐标轴顶点半径
        axisLineThickness: 1,
        xTickeValueArea: 45, // x轴标尺文字高度
        yTickeValueArea: 0, // y轴标尺文字高度
        tickeValueFontSize: 12, // 标尺文字大小
        tickeValueFontWeight: 400,
        tickeValueFontWeightBold: 700,
        tickButtonWidth: 40,
        tickButtonHeight: 22,
      },
      colors: {
        defi: "#6884DC",
        staking: "#925BCA",
        liquid: "#EEAD00",
      },
      chartArea: {},
      dataDefi: [],
      dataStaking: [],
      dataLiquid: [],
      xScale: {},
      yScale: {},
      myLine: {},
      xAxis: {},
      yAxis: {},
      selectedIndex: -1,
    };
  },

  mounted() {
    this.init();

    this.selectedIndex = this.selected ?? -1;
    this.haldleSelection();
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

      //#region axis

      const axisX = svg
        .append("g")
        .attr("class", "axis-x")
        .attr("transform", `translate(0, ${this.widthes.axisDot + this.chartArea.size.height})`)
        .call(this.xAxis);
      svg
        .append("g")
        .attr("class", "axis-y")
        .attr("transform", `translate(${this.widthes.axisDot + this.chartArea.size.width}, 0)`)
        .call(this.yAxis);

      // 修正x轴两端刻度
      // axisX.selectAll(".tick:nth-child(2)").attr("transform", "translate(8, 0)");
      axisX.selectAll(`.tick:nth-child(6)`).attr("transform", `translate(${this.widthes.axisDot + this.chartArea.size.width - 19}, 0)`);
      axisX.selectAll(".tick:nth-child(2)").remove();

      axisX.selectAll(".tick").on("click", event => {
        const selected = parseInt(event.target.innerHTML.substring(0, 1));
        this.selectedIndex = selected;
        this.haldleSelection();
      });

      //#endregion

      //#region 曲线

      this.myLine = line()
        .curve(curveCardinal)
        .x(d => this.xScale(d.date))
        .y(d => this.yScale(d.value));

      svg
        .append("path")
        .attr("id", "defi-bg")
        .attr("fill", "none")
        .attr("stroke", this.colors.defi)
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", 0.3)
        .attr("d", this.myLine(this.dataDefi));

      svg
        .append("path")
        .attr("id", "staking-bg")
        .attr("fill", "none")
        .attr("stroke", this.colors.staking)
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", 0.3)
        .attr("d", this.myLine(this.dataStaking));

      svg
        .append("path")
        .attr("id", "liquid-bg")
        .attr("fill", "none")
        .attr("stroke", this.colors.liquid)
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", 0.3)
        .attr("d", this.myLine(this.dataLiquid));

      //#endregion

      // svg.on("click", this.handleClick);
    },

    fillData() {
      this.dataDefi = [
        { date: 0, value: 1 },
        { date: 1, value: Math.pow(1 + this.apys.defi, 1) },
        { date: 2, value: Math.pow(1 + this.apys.defi, 2) },
        { date: 3, value: Math.pow(1 + this.apys.defi, 3) },
        { date: 4, value: Math.pow(1 + this.apys.defi, 4) },
      ];
      this.dataStaking = [
        { date: 0, value: 1 },
        { date: 1, value: Math.pow(1 + this.apys.staking, 1) },
        { date: 2, value: Math.pow(1 + this.apys.staking, 2) },
        { date: 3, value: Math.pow(1 + this.apys.staking, 3) },
        { date: 4, value: Math.pow(1 + this.apys.staking, 4) },
      ];
      this.dataLiquid = [
        { date: 0, value: 1 },
        { date: 1, value: Math.pow(1 + this.apys.liquid, 1) },
        { date: 2, value: Math.pow(1 + this.apys.liquid, 2) },
        { date: 3, value: Math.pow(1 + this.apys.liquid, 3) },
        { date: 4, value: Math.pow(1 + this.apys.liquid, 4) },
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

      this.xAxis = axisBottom(this.xScale)
        .ticks(4, null)
        .tickFormat(d => d + "Y")
        .tickSizeOuter(0)
        .tickSizeInner(0)
        .tickPadding(25);

      const maxApy = Math.max(this.apys.defi, this.apys.staking, this.apys.liquid);
      if (maxApy === this.apys.defi) {
        this.yScale = scaleLinear()
          .domain([this.dataDefi[0].value, this.dataDefi[this.dataDefi.length - 1].value])
          .range([this.chartArea.bottomLeft.y, this.widthes.axisDot]);
      } else if (maxApy === this.apys.staking) {
        this.yScale = scaleLinear()
          .domain([this.dataStaking[0].value, this.dataStaking[this.dataStaking.length - 1].value])
          .range([this.chartArea.bottomLeft.y, this.widthes.axisDot]);
      } else {
        this.yScale = scaleLinear()
          .domain([this.dataLiquid[0].value, this.dataLiquid[this.dataLiquid.length - 1].value])
          .range([this.chartArea.bottomLeft.y, this.widthes.axisDot]);
      }
      this.yAxis = axisRight(this.yScale).ticks(0, "").tickSizeOuter(0).tickSizeInner(0);
    },

    haldleSelection() {
      const svg = select("#_mechanism_chart");
      svg.selectAll("#staking-selected").remove();

      const selected = this.selectedIndex;
      console.log("haldleSelection", selected);
      if (selected < 0) return;

      let data;
      data = this.dataDefi.filter(m => m.date <= selected);
      svg
        .append("path")
        .attr("id", "staking-selected")
        .attr("fill", "none")
        .attr("stroke", this.colors.defi)
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", 1)
        .attr("d", this.myLine(data));

      data = this.dataStaking.filter(m => m.date <= selected);
      svg
        .append("path")
        .attr("id", "staking-selected")
        .attr("fill", "none")
        .attr("stroke", this.colors.staking)
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", 1)
        .attr("d", this.myLine(data));

      data = this.dataLiquid.filter(m => m.date <= selected);
      svg
        .append("path")
        .attr("id", "staking-selected")
        .attr("fill", "none")
        .attr("stroke", this.colors.liquid)
        .attr("stroke-width", 4)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("stroke-opacity", 1)
        .attr("d", this.myLine(data));

      //#region axis x

      svg.select(".axis-x").selectAll(`.tick`).classed("tick-selected", false);
      svg
        .select(".axis-x")
        .selectAll(`.tick:nth-child(${1 + selected})`)
        .classed("tick-selected", true);

      const offsetLast = selected === 4 ? -16 : 3;
      svg.select("#axis-x-selected-border").remove();
      svg
        .append("rect")
        .attr("id", "axis-x-selected-border")
        .attr("x", this.widthes.yTickeValueArea + (this.chartArea.size.width / 4) * selected - this.widthes.tickButtonWidth / 2 + offsetLast)
        .attr("y", this.chartArea.size.height + this.widthes.xTickeValueArea - this.widthes.tickButtonHeight - 2)
        .attr("width", this.widthes.tickButtonWidth)
        .attr("height", this.widthes.tickButtonHeight)
        .attr("rx", this.widthes.tickButtonHeight / 2)
        .attr("ry", this.widthes.tickButtonHeight / 2)
        .attr("fill", "rgba(0,0,0,0)")
        .attr("stroke", "#925BCA")
        .attr("stroke-width", 1);

      //#endregion
    },

    handleClick(event) {
      const selected = Math.ceil(this.xScale.invert(event.x));
      // this.haldleSelection(selected);
      this.selectedIndex = selected;
      console.log(this.selectedIndex);
      this.haldleSelection();
    },
  },
};
</script>

<style lang="less">
#_mechanism_chart {
  .axis-x {
    .domain {
      stroke: #dddcea;
    }
    .tick {
      text {
        font-family: "Mulish Bold";
        font-size: 14px;
        fill: #2c2236;
      }
    }
    .tick-selected {
      text {
        fill: #925bca;
      }
    }
  }

  .axis-y {
    .domain {
      stroke: #dddcea;
    }
  }
}
</style>
