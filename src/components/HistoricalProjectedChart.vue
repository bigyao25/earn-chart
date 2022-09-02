<template>
  <div class="chart relative">
    <svg :id="svgId" :height="height" :width="width" class="_hp_chart"></svg>
  </div>
</template>

<script>
/**
 * ✅TODO：黑夜模式
 * ✅TODO: Y轴刻度+网格线
 * ✅TODO: 小数精度
 * ✅TODO: 最后一天的tip无法显示
 * ✅TODO: 鼠标竖线上下的小菱形
 *
 * ✅BUG: 30000级别的图表，给了300级别数据重新render时，显示错误
 * ✅BUG: today的tip背景总是黑色
 * ✅BUG: Y轴刻度小于1时显示错误
 * ✅BUG: 曲线阴影没有与曲线贴合
 */
import dayjs from "dayjs";
import { select } from "d3-selection";
import { scaleUtc, scaleLinear } from "d3-scale";
import { line, curveLinear, curveBasis, curveCardinal, curveMonotoneX, curveCatmullRom, stack, area, symbol, symbolSquare } from "d3-shape";
import "d3-transition";
import { Decimal } from "decimal.js";
// import { format } from "d3-format";
import { abridgeNumber, makeTicks } from "../utils/utils";

// curveBasis: (出现峰值时无法到达)
// curveCardinal: (严重下陷)
// curveMonotoneX: x轴单调
// curveCatmullRom: (略微下陷)
const myCurve = curveMonotoneX;

export default {
  props: {
    svgId: { type: String, default: "_hp_chart" },
    height: { type: Number, default: 400 },
    width: { type: Number, default: 500 },
    data: Object,
    dark: { type: Boolean, default: false },
  },
  data() {
    return {
      widthes: {
        axisDot: 2.5,
        axisLineThickness: 1,
        xTickeValueArea: 30,
        yTickeValueArea: 50,
        marginTop: 8,
        tickValueFontSize: 12,
        tickValueFontWeight: 400,
      },
      colors: {
        background: "#FFFFFF",
        axisLine: "#DDDCEA",
        axisLineDark: "#433b71",
        lineHistorical: "#55AA00",
        lineProjectedCurrent: "#6884DC",
        lineProjectedPotential: "#925BCA",
        fontTip: "#2C2236",
        dark: {
          background: "#140b22",
        },
      },
      historicalData: [...this.data.historical, this.data.today],
      todayData: this.data.today,
      projectedCurrentData: [this.data.today, ...this.data.projectedCurrent],
      projectedPotentialData: [this.data.today, ...this.data.projectedPotential],
      allData: [],
      chartArea: {},
      xScale: {},
      yScale: {},
      yValueRange: { min: 0, max: 0 },
      lineH: {},
      leftSeries: {},
      leftFill: [],
      leftArea: {},
      rightSeries: {},
      rightFill: [],
      rightArea: {},
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    initScale() {
      // 曲线绘制的区域（不包括坐标系区域）
      this.chartArea = {
        bottomLeft: { x: this.widthes.yTickeValueArea + this.widthes.axisDot, y: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot },
        size: {
          width: this.width - this.widthes.yTickeValueArea - this.widthes.axisDot - this.widthes.axisDot,
          height: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot - this.widthes.axisDot - this.widthes.marginTop,
        },
      };

      this.allData = [...this.data.historical, this.data.today, ...this.data.projectedCurrent, ...this.data.projectedPotential];
      const allDates = this.allData.map(m => dayjs(m.date));
      const allValues = this.allData.map(m => m.value);
      this.xScale = scaleUtc()
        .domain([allDates[0], allDates[allDates.length - 1].add(2, "hour")])
        .range([this.chartArea.bottomLeft.x, this.chartArea.bottomLeft.x + this.chartArea.size.width]);

      const valueMin = Math.min(...allValues);
      const valueMax = Math.max(...allValues);
      let yMin = valueMin - (valueMax - valueMin) / 10;
      yMin = yMin > 0 ? yMin : 0;
      const yMax = valueMax + (valueMax - valueMin) / 10;
      this.yValueRange = { min: yMin, max: yMax };
      this.yScale = scaleLinear()
        .domain([yMin, yMax])
        .range([this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height, this.widthes.marginTop + this.widthes.axisDot]);
    },

    initAreas() {
      const allValuesH = this.data.historical.map(m => m.value);
      const leftStackData = this.data.historical.map(m => ({ date: m.date, baseline: this.yValueRange.min, historical: m.value }));
      leftStackData.push({ date: this.data.today.date, baseline: this.yValueRange.min, historical: this.data.today.value }); // today
      const leftStack = stack().keys(["baseline", "historical"]);
      this.leftSeries = leftStack(leftStackData);
      this.leftFill = ["transparent", "url(#gradientH)"];

      const rightStackData = this.projectedCurrentData.map(m => ({
        date: m.date,
        baseline: this.yValueRange.min,
        projectedCurrent: m.value - this.yValueRange.min, // 得到差值
        projectedPotential: this.projectedPotentialData.find(p => p.date.isSame(m.date)).value - m.value, // 得到差值
      }));
      const rightStack = stack().keys(["baseline", "projectedCurrent", "projectedPotential"]);
      this.rightSeries = rightStack(rightStackData);
      this.rightFill = ["transparent", "url(#gradientPC)", "url(#gradientPP)"];
    },

    initAxis() {
      const svg = select(`#${this.svgId}`);
      if (svg.select("#axis").empty()) svg.append("g").attr("id", "axis");
      const root = svg.select("#axis");
      root.selectAll("*").remove();

      //#region y
      root
        .append("line")
        .attr("x1", this.chartArea.bottomLeft.x + this.chartArea.size.width)
        .attr("y1", this.widthes.axisDot)
        .attr("x2", this.chartArea.bottomLeft.x + this.chartArea.size.width)
        .attr("y2", this.widthes.marginTop + this.chartArea.size.height + this.widthes.axisDot)
        .attr("marker-end", "url(#hp-axisDot)")
        .attr("marker-start", "url(#hp-axisDot)");

      const yTicks = makeTicks(this.yValueRange.min, this.yValueRange.max, 2);
      yTicks.forEach(n => {
        const tick = n < 1000 ? abridgeNumber(n, 2) : abridgeNumber(n, 1);
        root
          .append("line")
          .attr("x1", this.chartArea.bottomLeft.x)
          .attr("y1", this.yScale(n))
          .attr("x2", this.chartArea.bottomLeft.x + this.chartArea.size.width)
          .attr("y2", this.yScale(n))
          .attr("stroke-dasharray", "8,8")
          .attr("stroke-width", 1);
        root
          .append("text")
          .attr("x", this.widthes.yTickeValueArea - 2)
          .attr("y", this.yScale(n))
          // .text(`$${format(".2~s")(n.toNumber()).toUpperCase()}`)
          .text(`$${tick}`)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .attr("font-family", "Mulish Regular")
          .attr("font-size", `${this.widthes.tickValueFontSize}px`)
          .attr("font-weight", this.widthes.tickValueFontWeight);
      });
      //#endregion

      //#region x
      // 轴线
      root
        .append("line")
        .attr("x1", this.chartArea.bottomLeft.x)
        .attr("y1", this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height)
        .attr("x2", this.chartArea.bottomLeft.x + this.chartArea.size.width)
        .attr("y2", this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height)
        .attr("marker-end", "url(#hp-axisDot)")
        .attr("marker-start", "url(#hp-axisDot)");
      // 中点
      // root
      //   .append("line")
      //   .attr("class", "axis-center-line")
      //   .attr("x1", this.xScale(this.data.today.date) - 65)
      //   .attr("y1", this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height)
      //   .attr("x2", this.xScale(this.data.today.date))
      //   .attr("y2", this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height)
      //   .attr("stroke-width", 1.2)
      //   .attr("marker-end", "url(#axisDot)");
      // root
      //   .append("line")
      //   .attr("class", "axis-center-line")
      //   .attr("x1", this.xScale(this.data.today.date))
      //   .attr("y1", this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height)
      //   .attr("x2", this.xScale(this.data.today.date) + 65)
      //   .attr("y2", this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height)
      //   .attr("stroke-width", 1.2)
      //   .attr("marker-start", "url(#axisDot)");
      // Historical
      root
        .append("text")
        .text("Historical")
        .attr("class", "text-historical")
        .attr("x", this.xScale(this.data.today.date) - 60)
        .attr("y", this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height + 13)
        .attr("filter", "url(#solid)")
        .attr("font-family", "Mulish Regular")
        .attr("font-size", `${this.widthes.tickValueFontSize}px`)
        .attr("font-weight", this.widthes.tickValueFontWeight);
      // Projected
      root
        .append("text")
        .text("Projected")
        .attr("class", "text-projected")
        .attr("x", this.xScale(this.data.today.date) + 8)
        .attr("y", this.widthes.marginTop + this.widthes.axisDot + this.chartArea.size.height + 13)
        .attr("filter", "url(#solid)")
        .attr("font-family", "Mulish Regular")
        .attr("font-size", `${this.widthes.tickValueFontSize}px`)
        .attr("font-weight", this.widthes.tickValueFontWeight);
      // x 文字
      const dateToday = this.data.today.date;
      const dateMin = this.data.historical[0].date;
      const dateMax = this.data.projectedPotential.slice(-1)[0].date;
      root
        .append("text")
        .text(dateMin.format("MMM D, YYYY"))
        .attr("id", "x-tick-min")
        .attr("x", this.widthes.yTickeValueArea - this.widthes.axisDot / 2)
        .attr("y", this.height - this.widthes.axisDot)
        .attr("font-family", "Mulish Bold")
        .attr("font-size", `${this.widthes.tickValueFontSize}px`);
      root
        .append("text")
        .text(dateToday.format("MMM D, YYYY"))
        .attr("id", "x-tick-today")
        .attr("x", this.widthes.yTickeValueArea + this.chartArea.size.width / 2)
        .attr("y", this.height - this.widthes.axisDot)
        .attr("font-family", "Mulish Bold")
        .attr("font-size", `${this.widthes.tickValueFontSize}px`)
        .attr("text-anchor", "middle");
      root
        .append("text")
        .text(dateMax.format("MMM D, YYYY"))
        .attr("id", "x-tick-max")
        .attr("x", this.width)
        .attr("y", this.height - this.widthes.axisDot)
        .attr("text-anchor", "end")
        .attr("font-family", "Mulish Bold")
        .attr("font-size", `${this.widthes.tickValueFontSize}px`);

      //#endregion
    },

    init() {
      this.initScale();
      this.initAreas();

      const svg = select(`#${this.svgId}`);
      svg.classed("dark", this.dark);
      svg.selectAll("*").remove();

      var defs = svg.append("defs");
      var root;

      //#region defs

      // 坐标轴圆点
      var arrowMarker = defs
        .append("marker")
        .attr("id", "hp-axisDot")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", this.widthes.axisDot * 2)
        .attr("markerHeight", this.widthes.axisDot * 2)
        .attr("viewBox", `0 0 ${this.widthes.axisDot * 2} ${this.widthes.axisDot * 2}`)
        .attr("refX", this.widthes.axisDot)
        .attr("refY", this.widthes.axisDot)
        .attr("orient", "auto");
      arrowMarker
        .append("circle")
        .attr("cx", this.widthes.axisDot)
        .attr("cy", this.widthes.axisDot)
        .attr("r", this.widthes.axisDot)
        .attr("fill", this.dark ? this.colors.axisLineDark : this.colors.axisLine);
      // 背景色遮罩
      var whiteFilter = defs.append("filter").attr("x", 0).attr("y", 0).attr("width", 1).attr("height", 1).attr("id", "solid");
      whiteFilter.append("feFlood").attr("flood-color", this.dark ? this.colors.dark.background : this.colors.background);
      whiteFilter.append("feComposite").attr("in", "SourceGraphic").attr("operator", "atop");

      const gradientH = defs.append("linearGradient").attr("id", "gradientH");
      gradientH.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
      // gradientH.attr("gradientUnits", "userSpaceOnUse");
      gradientH.attr("gradientUnits", "objectBoundingBox");
      gradientH.append("stop").attr("offset", "37.58%").attr("stop-color", "rgba(85, 170, 0, 0.1)");
      gradientH.append("stop").attr("offset", "100%").attr("stop-color", "rgba(85, 170, 0, 0)");

      const gradientPC = defs.append("linearGradient").attr("id", "gradientPC");
      gradientPC.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
      gradientPC.attr("gradientUnits", "objectBoundingBox");
      gradientPC.append("stop").attr("offset", "37.58%").attr("stop-color", "rgba(110, 135, 215, 0.1)");
      gradientPC.append("stop").attr("offset", "100%").attr("stop-color", "rgba(110, 135, 215, 0)");

      const gradientPP = defs.append("linearGradient").attr("id", "gradientPP");
      gradientPP.attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
      gradientPP.attr("gradientUnits", "objectBoundingBox");
      gradientPP.append("stop").attr("offset", "20.38%").attr("stop-color", "rgba(146, 91, 202, 0.25)");
      gradientPP.append("stop").attr("offset", "88.54%").attr("stop-color", "rgba(146, 91, 202, 0)");

      //#endregion

      svg.append("rect").attr("id", "bg").attr("width", "100%").attr("height", "100%");

      this.initAxis();

      //#region area

      // left
      this.leftArea = area()
        .x(d => this.xScale(d.data.date))
        .y0(d => this.yScale(d[0]))
        .y1(d => this.yScale(d[1] - d[0]))
        .curve(myCurve);
      root = svg.append("g");
      root
        .attr("id", "leftArea")
        .selectAll("path")
        .data(this.leftSeries)
        .enter()
        .append("path")
        .attr("d", this.leftArea)
        .attr("fill", (d, i) => this.leftFill[i]);

      // right
      this.rightArea = area()
        .x(d => this.xScale(d.data.date))
        .y0(d => this.yScale(d[0]))
        .y1(d => this.yScale(d[1]))
        .curve(myCurve);
      root = svg.append("g");
      root
        .attr("id", "rightArea")
        .selectAll("path")
        .data(this.rightSeries)
        .enter()
        .append("path")
        .attr("d", this.rightArea)
        .attr("fill", (d, i) => this.rightFill[i]);

      //#endregion

      //#region lines

      root = svg.append("g").attr("id", "lines");

      // historical
      this.lineH = line()
        .x(d => this.xScale(dayjs(d.date)))
        .y(d => this.yScale(d.value))
        .curve(myCurve);
      // historical
      root.append("path").datum(this.historicalData).attr("id", "chartH").attr("d", this.lineH).attr("stroke", this.colors.lineHistorical).attr("stroke-width", 3).attr("fill", "transparent");
      // projectedCurrent
      root
        .append("path")
        .datum(this.projectedCurrentData)
        .attr("id", "chartPC")
        .attr("d", this.lineH)
        .attr("stroke", this.colors.lineProjectedCurrent)
        .attr("stroke-width", 3)
        .attr("fill", "transparent");
      // projectedPotential
      root
        .append("path")
        .datum(this.projectedPotentialData)
        .attr("id", "chartPP")
        .attr("d", this.lineH)
        .attr("stroke", this.colors.lineProjectedPotential)
        .attr("stroke-width", 3)
        .attr("fill", "transparent");

      //#endregion

      //#region today

      // line
      root = svg.append("g").attr("id", "today");
      root
        .append("line")
        .attr("x1", this.xScale(this.data.today.date))
        .attr("y1", this.widthes.axisDot)
        .attr("x2", this.xScale(this.data.today.date))
        .attr("y2", this.widthes.axisDot + this.chartArea.size.height + this.widthes.marginTop)
        .attr("stroke-dasharray", "8,8")
        .attr("stroke-width", 1);

      // dot
      const dotDate = this.data.today.date;
      const dotValue = this.data.today.value;
      this.drawDot(root, dotDate, dotValue, this.colors.lineHistorical, "rgba(85, 170, 0, 0.9)");

      //#endregion

      //#region hover

      svg.on("pointermove", this.pointermoved);
      svg.on("mouseleave", () => {
        select(`#${this.svgId}`).selectAll("#hover").transition().duration(300).remove();
      }); // comment if DEBUG

      //#endregion
    },

    pointermoved(e) {
      const x = e.offsetX,
        y = e.offsetY;
      const svg = select(`#${this.svgId}`);

      if (x <= this.chartArea.bottomLeft.x || x >= this.chartArea.bottomLeft.x + this.chartArea.size.width || y >= this.chartArea.bottomLeft.y || y <= this.widthes.axisDot) {
        svg.selectAll("#hover").remove();
        return;
      }

      let date = dayjs(this.xScale.invert(x));
      date = dayjs(date.format("YYYY-MM-DD"));

      svg.selectAll("#hover").remove();
      const root = svg.append("g").attr("id", "hover");

      // line
      root
        .append("line")
        .attr("id", "hover-line")
        .attr("x1", this.xScale(date))
        .attr("y1", this.chartArea.bottomLeft.y)
        .attr("x2", this.xScale(date))
        .attr("y2", this.chartArea.bottomLeft.y - this.chartArea.size.height)
        .attr("stroke", this.colors.lineHistorical)
        .attr("stroke-dasharray", "8,8")
        .attr("stroke-width", 1);

      const drawDiamond = (x, y, size, root) => {
        let diamond = symbol().type(symbolSquare).size(size);
        root.append("path").attr("d", diamond).attr("fill", this.colors.lineHistorical).attr("transform", `translate(${x},${y}) rotate(45)`);
      };
      const sizeDiamond = 15;
      drawDiamond(this.xScale(date), this.chartArea.bottomLeft.y, sizeDiamond, root);
      drawDiamond(this.xScale(date), this.chartArea.bottomLeft.y - this.chartArea.size.height - Math.sqrt(sizeDiamond) / 2, sizeDiamond, root);

      // shadow area
      // root
      //   .append("rect")
      //   .attr("x", this.xScale(date))
      //   .attr("y", this.chartArea.bottomLeft.y - this.chartArea.size.height - Math.sqrt(sizeDiamond) / 2)
      //   .attr("width", this.xScale(date.add(1, "day")) - this.xScale(date))
      //   .attr("height", this.chartArea.size.height + Math.sqrt(sizeDiamond) / 2)
      //   .attr("fill", "rgba(85, 170, 0, 0.1)");

      // dot
      const itemH = this.historicalData.find(m => m.date.isSame(date, "date"));
      if (itemH) {
        this.drawDot(root, date, itemH.value, this.colors.lineHistorical, "rgba(85, 170, 0, 0.9)");
        this.drawTip1(root, date, itemH.value);
        return;
      }
      const itemPC = this.projectedCurrentData.find(m => m.date.isSame(date, "date"));
      const itemPP = this.projectedPotentialData.find(m => m.date.isSame(date, "date"));
      if (itemPC && itemPP) {
        this.drawDot(root, date, itemPC.value, this.colors.lineProjectedCurrent, "rgba(104, 132, 220, 0.9)");
        this.drawDot(root, date, itemPP.value, this.colors.lineProjectedPotential, "rgba(146, 91, 202, 0.9)");
        this.drawTip2(root, date, itemPC.value, itemPP.value);
      }
    },

    drawDot(root, date, value, fillColor, filterColor) {
      const obj = root
        .append("circle")
        .attr("id", "today-dot")
        .attr("cx", this.xScale(date))
        .attr("cy", this.yScale(value))
        .attr("r", 5)
        .attr("fill", fillColor)
        .attr("stroke", "#FFFFFF")
        .attr("stroke-width", "2")
        .attr("filter", `drop-shadow(0 0 8px ${filterColor})`)
        .attr("data-date", date)
        .attr("data-value", value);
    },

    drawTip2(root, date, valuePC, valuePP) {
      let tip = select("#tip");
      const tipWidth = 130;
      const tipHeight = 95;
      const cx = this.xScale(date);
      const cyPC = this.yScale(valuePC);
      const cyPP = this.yScale(valuePP);

      let tipX = cx - tipWidth / 2;
      let tipY = cyPP - tipHeight - 10;
      if (tipX < this.chartArea.bottomLeft.x) {
        tipX = this.chartArea.bottomLeft.x;
      } else if (tipX + tipWidth > this.chartArea.bottomLeft.x + this.chartArea.size.width) {
        tipX = cx - tipWidth - 10;
      }
      if (tipY < 0) {
        if (tipX === cx - tipWidth - 10) {
          tipY = cyPP;
        } else {
          tipY = cyPC + 10;
        }
      }

      tip = root.append("g").attr("id", "tip").attr("x", tipX).attr("y", tipY);

      const rect = tip
        .append("rect")
        .attr("id", "tip")
        .attr("x", tipX)
        .attr("y", tipY)
        .attr("rx", 8)
        .attr("width", tipWidth)
        .attr("height", tipHeight)
        .attr("filter", "drop-shadow(-3px 5px 10px rgba(46, 31, 61, 0.1))");

      tip
        .append("text")
        .text(dayjs(date).format("MMM D"))
        .attr("dx", tipX + tipWidth / 2)
        .attr("dy", tipY + 20)
        .attr("style", "font-family: Mulish Regular; font-size: 12px; font-weight: 400;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);

      // Suggested Rewards
      tip
        .append("text")
        .text("Suggested Rewards")
        .attr("dx", tipX + tipWidth / 2)
        .attr("dy", tipY + 35)
        .attr("style", "font-family: Mulish Bold; font-size: 12px;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);

      tip
        .append("text")
        .text(`$${abridgeNumber(valuePP)}`)
        .attr("dx", tipX + tipWidth / 2)
        .attr("dy", tipY + 50)
        .attr("style", "font-family: Mulish Bold; font-size: 14px;")
        .attr("text-anchor", "middle")
        .attr("class", "text-pp");

      // Projected Rewards
      tip
        .append("text")
        .text("Projected Rewards")
        .attr("dx", tipX + tipWidth / 2)
        .attr("dy", tipY + 70)
        .attr("style", "font-family: Mulish Bold; font-size: 12px;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);

      tip
        .append("text")
        .text(`$${abridgeNumber(valuePC)}`)
        .attr("dx", tipX + tipWidth / 2)
        .attr("dy", tipY + 85)
        .attr("style", "font-family: Mulish Bold; font-size: 14px;")
        .attr("text-anchor", "middle")
        .attr("class", "text-pc");
    },

    drawTip1(root, date, value) {
      let tip = select("#tip");
      const tipWidth = 130;
      const tipHeight = 70;
      const cx = this.xScale(date);
      const cy = this.yScale(value);

      let tipX = cx - tipWidth / 2;
      let tipY = cy - tipHeight - 10;
      if (tipX < this.chartArea.bottomLeft.x) {
        tipX = this.chartArea.bottomLeft.x;
      } else if (tipX + tipWidth > this.chartArea.bottomLeft.x + this.chartArea.size.width) {
        tipX = cx - tipWidth;
      }
      if (tipY < 0) {
        tipY = cy + 10;
      } else {
      }

      tip = root.append("g").attr("id", "tip").attr("x", tipX).attr("y", tipY);

      const rect = tip
        .append("rect")
        .attr("id", "tip")
        .attr("x", tipX)
        .attr("y", tipY)
        .attr("rx", 8)
        .attr("width", tipWidth)
        .attr("height", tipHeight)
        .attr("filter", "drop-shadow(-3px 5px 10px rgba(46, 31, 61, 0.1))");

      const tipDate = date;
      const tipValue = value;

      tip
        .append("text")
        .text(dayjs(tipDate).format("MMM D"))
        .attr("dx", tipX + tipWidth / 2)
        .attr("dy", tipY + 20)
        .attr("style", "font-family: Mulish Regular; font-size: 12px; font-weight: 400;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);

      tip
        .append("text")
        .text("Rewards")
        .attr("dx", tipX + tipWidth / 2)
        .attr("dy", tipY + 40)
        .attr("style", "font-family: Mulish Bold; font-size: 14px;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);

      tip
        .append("text")
        // .text(`$${format(".2~s")(tipValue)}`)
        .text(`$${abridgeNumber(tipValue)}`)
        .attr("dx", tipX + tipWidth / 2)
        .attr("dy", tipY + 60)
        .attr("style", "font-family: Mulish Bold; font-size: 14px;")
        .attr("text-anchor", "middle")
        .attr("fill", this.colors.fontTip);
    },
  },

  watch: {
    data: function () {
      this.historicalData = [...this.data.historical, this.data.today];
      this.todayData = this.data.today;
      this.projectedCurrentData = [this.data.today, ...this.data.projectedCurrent];
      this.projectedPotentialData = [this.data.today, ...this.data.projectedPotential];

      this.initScale();
      this.initAxis();

      //#region 标尺文字

      const dateToday = this.data.today.date;
      const dateMin = this.data.historical[0].date;
      const dateMax = this.data.projectedPotential.slice(-1)[0].date;
      select(`#${this.svgId} #x-tick-min`).text(dateMin.format("MMM D, YYYY"));
      select(`#${this.svgId} #x-tick-today`).text(dateToday.format("MMM D, YYYY"));
      select(`#${this.svgId} #x-tick-max`).text(dateMax.format("MMM D, YYYY"));

      //#endregion

      //#region area

      this.initAreas();
      // left
      const leftArea = select(`#${this.svgId} #leftArea`);
      leftArea.selectAll("path").data([]).exit().remove();
      leftArea
        .selectAll("path")
        .data(this.leftSeries)
        .enter()
        .append("path")
        .transition()
        .delay(200)
        .attr("d", this.leftArea)
        .attr("fill", (d, i) => this.leftFill[i]);

      // right
      const rightArea = select(`#${this.svgId} #rightArea`);
      rightArea.selectAll("path").data([]).exit().remove();
      rightArea
        .selectAll("path")
        .data(this.rightSeries)
        .enter()
        .append("path")
        .transition()
        .delay(200)
        .attr("d", this.rightArea)
        .attr("fill", (d, i) => this.rightFill[i]);

      //#endregion

      //#region 曲线
      select(`#${this.svgId} #chartH`).datum(this.historicalData).transition().attr("d", this.lineH);
      select(`#${this.svgId} #chartPC`).datum(this.projectedCurrentData).transition().attr("d", this.lineH);
      select(`#${this.svgId} #chartPP`).datum(this.projectedPotentialData).transition().attr("d", this.lineH);
      //#endregion

      //#region today
      select(`#${this.svgId} #today-dot`)
        .transition()
        .attr("cx", this.xScale(dayjs(this.data.today.date)))
        .attr("cy", this.yScale(this.data.today.value))
        .attr("data-date", this.data.today.date)
        .attr("data-value", this.data.today.value);
      //#endregion
    },
    dark: function () {
      this.init();
    },
  },
};
</script>

<style lang="less">
.chart {
  display: inline-block;

  ._hp_chart {
    #bg {
      fill: white;
    }
    #axis {
      line {
        stroke: #dddcea;
      }
      .axis-center-line {
        stroke: #ffffff;
      }
      text {
        fill: #565672;
      }
      .text-historical {
        fill: #55aa00;
      }
      .text-projected {
        fill: #6884dc;
      }
    }
    #today {
      line {
        stroke: #dddcea;
      }
    }
    #tip {
      fill: white;
      stroke: #dddcea;
      text {
        fill: #2c2236;
        stroke: none;
      }
      .text-pc {
        fill: #6884dc;
      }
      .text-pp {
        fill: #925bca;
      }
    }

    &.dark {
      #bg {
        fill: #140b22;
      }
      #axis {
        line {
          stroke: #433b71;
        }
        .axis-center-line {
          stroke: #140b22;
        }
        text {
          fill: #cbb7e0;
        }
        .text-historical {
          fill: #55aa00;
        }
        .text-projected {
          fill: #6884dc;
        }
      }
      #today {
        line {
          stroke: #433b71;
        }
      }
      #tip {
        fill: #140b22;
        stroke: #433b71;
        text {
          fill: #ffffff;
          stroke: none;
        }
      }
    }
  }
}
</style>
