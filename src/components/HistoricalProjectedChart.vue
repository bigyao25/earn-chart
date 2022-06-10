<template>
  <div class="chart relative">
    <svg id="_chart" :height="height" :width="width"></svg>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import "d3-transition";

export default {
  // props: ["height", "width", "divide", "value", "breakpoint", "paddingTop", "paddingRight"],
  props: {
    height: { type: Number, default: 400 },
    width: { type: Number, default: 500 },
    data: Object,
  },
  data() {
    return {
      widthes: {
        axisDot: 2.5,
        axisLineThickness: 1,
        xTickeValueArea: 30, // x轴标尺文字高度
        yTickeValueArea: 50, // y轴标尺文字高度
        tickeValueFontSize: 12, // 标尺文字大小
        tickeValueFontWeight: 400,
        tickeValueFontWeightBold: 700,
      },
      colors: {
        background: "white",
        axisLine: "#DDDCEA",
        fontTickValue: "#565672",
        fontHistorical: "#55AA00",
        fontProjected: "#6884DC",
      },
    };
  },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      const all = [...this.data.historical, this.data.today, ...this.data.projected];
      const xDates = all.map(m => m.date);
      const yValues = all.map(m => m.value);
      const xScale = scaleBand().domain(xDates).range([0, 500]);
      const yScale = scaleLinear().domain(yValues).range([0, 500]);
      console.log(1000, xScale(dayjs("2022-06-08")), yScale(144));

      const svg = select("#_chart");
      var defs = svg.append("defs");
      var g;

      /**
       * defs
       */
      // 坐标轴圆点
      var arrowMarker = defs
        .append("marker")
        .attr("id", "axisDot")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", this.widthes.axisDot * 2)
        .attr("markerHeight", this.widthes.axisDot * 2)
        .attr("viewBox", `0 0 ${this.widthes.axisDot * 2} ${this.widthes.axisDot * 2}`)
        .attr("refX", this.widthes.axisDot)
        .attr("refY", this.widthes.axisDot)
        .attr("orient", "auto");
      arrowMarker.append("circle").attr("cx", this.widthes.axisDot).attr("cy", this.widthes.axisDot).attr("r", this.widthes.axisDot).attr("fill", this.colors.axisLine);
      // 白色背景
      var whiteFilter = defs.append("filter").attr("x", 0).attr("y", 0).attr("width", 1).attr("height", 1).attr("id", "solid");
      whiteFilter.append("feFlood").attr("flood-color", this.colors.background);
      whiteFilter.append("feComposite").attr("in", "SourceGraphic").attr("operator", "atop");

      // 曲线绘制的区域（不包括坐标系区域）
      const chartArea = {
        bottomLeft: { x: this.widthes.yTickeValueArea + this.widthes.axisDot / 2, y: this.height - this.widthes.xTickeValueArea },
        size: {
          width: this.width - this.widthes.yTickeValueArea - this.widthes.axisDot - this.widthes.axisLineThickness,
          height: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot - this.widthes.axisLineThickness,
        },
      };
      /**
       * y坐标轴
       */
      g = svg.append("g");
      g.append("line")
        .attr("x1", chartArea.bottomLeft.x + chartArea.size.width)
        .attr("y1", this.widthes.axisDot)
        .attr("x2", chartArea.bottomLeft.x + chartArea.size.width)
        .attr("y2", chartArea.size.height + this.widthes.axisDot / 2)
        // .attr("y2", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea)
        // .attr("width", 4)
        .attr("stroke", this.colors.axisLine)
        .attr("marker-end", "url(#axisDot)")
        .attr("marker-start", "url(#axisDot)");

      /**
       * x坐标轴
       */
      // 轴线
      g = svg.append("g");
      g.append("line")
        .attr("x1", this.widthes.yTickeValueArea)
        .attr("y1", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea)
        .attr("x2", this.width - this.widthes.axisDot)
        .attr("y2", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea)
        // .attr("width", 40)
        .attr("stroke", this.colors.axisLine)
        .attr("marker-end", "url(#axisDot)")
        .attr("marker-start", "url(#axisDot)");
      // 中点
      g.append("line")
        .attr("x1", this.widthes.yTickeValueArea + chartArea.size.width / 2 - 10)
        .attr("y1", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea)
        .attr("x2", this.widthes.yTickeValueArea + chartArea.size.width / 2 + this.widthes.axisDot / 2)
        .attr("y2", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea)
        .attr("stroke", this.colors.background)
        .attr("marker-end", "url(#axisDot)");
      g.append("line")
        .attr("x1", (this.width - this.widthes.yTickeValueArea) / 2 + this.widthes.yTickeValueArea)
        .attr("y1", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea)
        .attr("x2", (this.width - this.widthes.yTickeValueArea) / 2 + this.widthes.yTickeValueArea + 10)
        .attr("y2", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea)
        .attr("stroke", this.colors.background)
        .attr("marker-start", "url(#axisDot)");
      // Historical
      g.append("text")
        .text("Historical")
        .attr("x", (this.width - this.widthes.yTickeValueArea) / 2 + this.widthes.yTickeValueArea + 6)
        .attr("y", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea + this.widthes.tickeValueFontSize / 2 - 1)
        .attr("filter", "url(#solid)")
        .attr("font-family", "Mulish")
        .attr("font-size", this.widthes.tickeValueFontSize)
        .attr("font-weight", this.widthes.tickeValueFontWeight)
        .attr("fill", this.colors.fontHistorical);
      // Projected
      g.append("text")
        .text("Projected")
        // .attr("text-anchor", "middle")
        .attr("x", (this.width - this.widthes.yTickeValueArea) / 2 + this.widthes.yTickeValueArea - 58)
        .attr("y", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea + this.widthes.tickeValueFontSize / 2 - 1)
        .attr("filter", "url(#solid)")
        .attr("font-family", "Mulish")
        .attr("font-size", this.widthes.tickeValueFontSize)
        .attr("font-weight", this.widthes.tickeValueFontWeight)
        .attr("fill", this.colors.fontProjected);
      // 标尺文字
      const dateToday = this.data.today.date;
      const dateMin = this.data.historical[0].date;
      const dateMax = this.data.projected.slice(-1)[0].date;
      g.append("text")
        .text(dateToday.format("MMM D, YYYY"))
        .attr("x", (this.width - this.widthes.yTickeValueArea) / 2 + this.widthes.yTickeValueArea - 30)
        .attr("y", this.height - this.widthes.axisDot)
        .attr("font-family", "Mulish Bold")
        .attr("font-size", this.widthes.tickeValueFontSize)
        // .attr("font-weight", this.widthes.tickeValueFontWeightBold)
        .attr("fill", this.colors.fontTickValue);
      g.append("text")
        .text(dateMin.format("MMM D, YYYY"))
        .attr("x", this.widthes.yTickeValueArea - this.widthes.axisDot / 2)
        .attr("y", this.height - this.widthes.axisDot)
        .attr("font-family", "Mulish Bold")
        .attr("font-size", this.widthes.tickeValueFontSize)
        // .attr("font-weight", this.widthes.tickeValueFontWeightBold)
        .attr("fill", this.colors.fontTickValue);
      g.append("text")
        .text(dateMax.format("MMM D, YYYY"))
        .attr("x", this.width - 75)
        .attr("y", this.height - this.widthes.axisDot)
        // .attr("text-anchor", "end")
        .attr("font-family", "Mulish Bold")
        .attr("font-size", this.widthes.tickeValueFontSize)
        // .attr("font-weight", this.widthes.tickeValueFontWeightBold)
        .attr("fill", this.colors.fontTickValue);

      this.layer1 = svg.append("g");
    },
  },
};
</script>

<style lang="less" scoped>
.chart {
  display: inline-block;
  border: 1px solid lightpink;
}
</style>
