<template>
  <div class="chart relative">
    <svg id="_chart" :height="height" :width="width"></svg>
  </div>
  <button v-on:click="handleClick">fresh</button>
</template>

<script>
import dayjs from "dayjs";
import { select } from "d3-selection";
import { scaleBand, scaleLinear } from "d3-scale";
import { line } from "d3-shape";
import "d3-transition";
import { Decimal } from "decimal.js";

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
        background: "white",
        axisLine: "#DDDCEA",
        fontTickValue: "#565672",
        fontHistorical: "#55AA00",
        fontProjected: "#6884DC",
        lineHistorical: "#55AA00",
        fontTip: "#2C2236",
      },
    };
  },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    init() {
      // 曲线绘制的区域（不包括坐标系区域）
      const chartArea = {
        bottomLeft: { x: this.widthes.yTickeValueArea + this.widthes.axisDot, y: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot },
        size: {
          width: this.width - this.widthes.yTickeValueArea - this.widthes.axisDot - this.widthes.axisDot,
          height: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot - this.widthes.axisDot,
        },
      };

      const all = [...this.data.historical, this.data.today, ...this.data.projected];
      const xDates = all.map(m => m.date);
      const yValues = all.map(m => m.value);
      const xScale = scaleBand()
        .domain(xDates)
        .range([chartArea.bottomLeft.x, chartArea.bottomLeft.x + chartArea.size.width]);
      // console.log(this.makeTike(0, 159).toString());
      // console.log(this.makeTike(1, 1042).toString());
      // console.log(this.makeTike(1, 2042).toString());
      // console.log(this.makeTike(1_044, 5_555).toString());
      // console.log(this.makeTike(3_452_321, 8_971_111).toString());
      // console.log(this.makeTike(2_321, 8_971_111).toString());
      const yValueRange = this.makeTike(Math.min(...yValues), Math.max(...yValues));
      const yScale = scaleLinear()
        .domain([yValueRange[0], yValueRange[2]])
        .range([chartArea.size.height, this.widthes.axisDot / 2]);

      const svg = select("#_chart");
      svg.selectAll("*").remove();

      var defs = svg.append("defs");
      var root;
      var obj;

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

      /**
       * y坐标轴
       */
      root = svg.append("g");
      root
        .append("line")
        .attr("x1", chartArea.bottomLeft.x + chartArea.size.width)
        .attr("y1", this.widthes.axisDot)
        .attr("x2", chartArea.bottomLeft.x + chartArea.size.width)
        .attr("y2", chartArea.size.height + this.widthes.axisDot)
        // .attr("y2", this.height - this.widthes.axisDot - this.widthes.xTickeValueArea)
        // .attr("width", 4)
        .attr("stroke", this.colors.axisLine)
        .attr("marker-end", "url(#axisDot)")
        .attr("marker-start", "url(#axisDot)");

      /**
       * x坐标轴
       */
      // 轴线
      root
        .append("line")
        .attr("x1", this.widthes.yTickeValueArea + this.widthes.axisDot)
        .attr("y1", this.widthes.axisDot + chartArea.size.height)
        .attr("x2", chartArea.bottomLeft.x + chartArea.size.width)
        .attr("y2", this.widthes.axisDot + chartArea.size.height)
        // .attr("width", 40)
        .attr("stroke", this.colors.axisLine)
        .attr("marker-end", "url(#axisDot)")
        .attr("marker-start", "url(#axisDot)");
      // 中点
      root
        .append("line")
        .attr("x1", xScale(this.data.today.date) - 20)
        .attr("y1", this.widthes.axisDot + chartArea.size.height)
        .attr("x2", xScale(this.data.today.date))
        .attr("y2", this.widthes.axisDot + chartArea.size.height)
        .attr("stroke", this.colors.background)
        .attr("stroke-width", 1.2)
        .attr("marker-end", "url(#axisDot)");
      root
        .append("line")
        .attr("x1", xScale(this.data.today.date))
        .attr("y1", this.widthes.axisDot + chartArea.size.height)
        .attr("x2", xScale(this.data.today.date) + 20)
        .attr("y2", this.widthes.axisDot + chartArea.size.height)
        .attr("stroke", this.colors.background)
        .attr("stroke-width", 1.2)
        .attr("marker-start", "url(#axisDot)");
      // Historical
      root
        .append("text")
        .text("Historical")
        .attr("x", xScale(this.data.today.date) - 60)
        .attr("y", this.widthes.axisDot + chartArea.size.height + 4)
        .attr("filter", "url(#solid)")
        .attr("font-family", "Mulish")
        .attr("font-size", this.widthes.tickeValueFontSize)
        .attr("font-weight", this.widthes.tickeValueFontWeight)
        .attr("fill", this.colors.fontHistorical);
      // Projected
      root
        .append("text")
        .text("Projected")
        .attr("x", xScale(this.data.today.date) + 8)
        .attr("y", this.widthes.axisDot + chartArea.size.height + 4)
        // .attr("text-anchor", "middle")
        .attr("filter", "url(#solid)")
        .attr("font-family", "Mulish")
        .attr("font-size", this.widthes.tickeValueFontSize)
        .attr("font-weight", this.widthes.tickeValueFontWeight)
        .attr("fill", this.colors.fontProjected);
      // 标尺文字
      const dateToday = this.data.today.date;
      const dateMin = this.data.historical[0].date;
      const dateMax = this.data.projected.slice(-1)[0].date;
      root
        .append("text")
        .text(dateToday.format("MMM D, YYYY"))
        .attr("x", (this.width - this.widthes.yTickeValueArea) / 2 + this.widthes.yTickeValueArea - 30)
        .attr("y", this.height - this.widthes.axisDot)
        .attr("font-family", "Mulish Bold")
        .attr("font-size", this.widthes.tickeValueFontSize)
        // .attr("font-weight", this.widthes.tickeValueFontWeightBold)
        .attr("fill", this.colors.fontTickValue);
      root
        .append("text")
        .text(dateMin.format("MMM D, YYYY"))
        .attr("x", this.widthes.yTickeValueArea - this.widthes.axisDot / 2)
        .attr("y", this.height - this.widthes.axisDot)
        .attr("font-family", "Mulish Bold")
        .attr("font-size", this.widthes.tickeValueFontSize)
        // .attr("font-weight", this.widthes.tickeValueFontWeightBold)
        .attr("fill", this.colors.fontTickValue);
      root
        .append("text")
        .text(dateMax.format("MMM D, YYYY"))
        .attr("x", this.width - 75)
        .attr("y", this.height - this.widthes.axisDot)
        // .attr("text-anchor", "end")
        .attr("font-family", "Mulish Bold")
        .attr("font-size", this.widthes.tickeValueFontSize)
        // .attr("font-weight", this.widthes.tickeValueFontWeightBold)
        .attr("fill", this.colors.fontTickValue);

      root = svg.append("g");

      // today line
      root
        .append("line")
        .attr("x1", xScale(this.data.today.date))
        .attr("y1", yScale(Math.min(...yValues)))
        .attr("x2", xScale(this.data.today.date))
        .attr("y2", yScale(Math.max(...yValues)))
        .attr("stroke", this.colors.axisLine)
        .attr("stroke-dasharray", "8,8")
        .attr("stroke-width", 1);

      // today dot
      obj = root
        .append("circle")
        .attr("cx", xScale(dayjs(this.data.today.date)))
        // .attr("cy", yScale((Math.min(...yValues) + Math.max(...yValues)) / 2))// 必居中
        .attr("cy", yScale(this.data.today.value))
        .attr("r", 5)
        .attr("fill", this.colors.lineHistorical)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", "2")
        .attr("filter", "drop-shadow(0 0 8px rgba(85, 170, 0, 0.9))")
        .attr("data-date", this.data.today.date)
        .attr("data-value", this.data.today.value);

      const $vue = this;
      obj.on("mouseover", function (d) {
        $vue.drawTip(this, root);
      });

      obj.on("mouseout", function (d) {
        var tip = select("#tip");
        tip.transition().duration(300).remove();
        console.log(tip);
      });
    },

    drawTip(obj, root, size, date, value) {
      var tip = select("#tip"); // TODO: 应该在 svg 中 select
      if (!tip.empty()) return;

      // const tipWidth = this.width * (0.5782 - 0.1425);
      // const tipHeight = this.height * ((0.4399 - 0.3703) / (0.8006 - 0.1994));
      const tipWidth = 130;
      const tipHeight = 70;
      var self = select(obj);
      const tipX = self.property("cx").baseVal.value - tipWidth / 2;
      const tipY = self.property("cy").baseVal.value - tipHeight - 10;

      tip = root.append("g").attr("id", "tip").attr("x", tipX).attr("y", tipY);

      const rect = tip
        .append("rect")
        .attr("id", "tip")
        .attr("x", tipX)
        .attr("y", tipY)
        .attr("rx", 8)
        .attr("width", tipWidth)
        .attr("height", tipHeight)
        .attr("fill", "white")
        .attr("stroke", 0.5)
        .attr("filter", "drop-shadow(-3px 5px 10px rgba(46, 31, 61, 0.1))");

      const tipDate = self.attr("data-date");
      const tipValue = self.attr("data-value");
      console.log(dayjs(tipDate).format("MMM D"));

      tip
        .append("text")
        .text(dayjs(tipDate).format("MMM D"))
        .attr("dx", self.property("cx").baseVal.value)
        .attr("dy", tipY + 20)
        // .attr("filter", "url(#solid)")
        .attr("style", "font-family: Mulish; font-size: 12; font-weight: 400;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);

      tip
        .append("text")
        .text("Rewards")
        .attr("dx", self.property("cx").baseVal.value)
        .attr("dy", tipY + 40)
        // .attr("filter", "url(#solid)")
        .attr("style", "font-family: Mulish Bold; font-size: 14;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);

      tip
        .append("text")
        .text(`$${tipValue}`)
        .attr("dx", self.property("cx").baseVal.value)
        .attr("dy", tipY + 60)
        // .attr("filter", "url(#solid)")
        .attr("style", "font-family: Mulish Bold; font-size: 14;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);
    },

    handleClick() {
      this.init();
    },
    // intlFormat(num) {
    //   return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
    // },
    // makeFriendly(num) {
    //   if (num >= 1000000) return intlFormat(num / 1000000) + "M";
    //   if (num >= 1000) return intlFormat(num / 1000) + "k";
    //   return intlFormat(num);
    // },
    intlFormat(num) {
      return new Intl.NumberFormat().format(Math.round(num * 10) / 10);
    },
    makeFrandly(num, isRoundUp) {
      // let quzheng = isRoundUp ? Decimal.ceil : Decimal.floor;

      const c1K = 1000,
        c1M = 1000000;
      let fixed;
      if (isRoundUp) {
        if (num.gt(c1M)) fixed = Decimal.ceil(Decimal.div(num, c1M)).times(c1M);
        else if (num.gt(c1K)) fixed = Decimal.ceil(Decimal.div(num, c1K)).times(c1K);
        else fixed = num;
      } else {
        if (num.gt(c1M)) fixed = Decimal.floor(Decimal.div(num, c1M)).times(c1M);
        else if (num.gt(c1K)) fixed = Decimal.floor(Decimal.div(num, c1K)).times(c1K);
        else fixed = num;
      }

      return fixed;
    },
    makeTike(min, max) {
      // min = Decimal(0);// y轴是否总是从0开始
      const fixedMin = this.makeFrandly(Decimal(min), false),
        fixedMax = this.makeFrandly(Decimal(max), true);
      const fixedMid = this.makeFrandly(Decimal.add(max, min).dividedBy(2), true);

      return [fixedMin, fixedMid, fixedMax];
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
