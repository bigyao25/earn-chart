<template>
  <div class="chart relative">
    <svg id="_mechanism_chart" ref="chartSvg" :height="height" :width="width"></svg>
  </div>
</template>

<script>
/**
 * ✅TODO：黑夜模式
 * ✅TODO: X轴网格线
 * ✅TODO: 应该传入每年的预计息后资产（加入复利的）
 */
import dayjs from "dayjs";
import { select } from "d3-selection";
import { scaleUtc, scaleLinear } from "d3-scale";
import { line, curveLinear, curveBasis, curveCardinal, stack, area } from "d3-shape";
import { axisBottom, axisRight } from "d3-axis";
import "d3-transition";
import { Decimal } from "decimal.js";
import { getInvestByApy } from "../utils/utils";

export default {
  props: {
    height: { type: Number, default: 400 },
    width: { type: Number, default: 500 },
    data: Array,
    selected: Number,
    onAxisClick: Function,
    dark: { type: Boolean, default: false },
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
        axisLine: "#DDDCEA",
        axisLineDark: "#433b71",
      },
      chartArea: {},
      dailyLinesData: [],
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

    this.selectedIndex = this.selected === undefined ? -1 : this.selected;
    this.haldleSelection();
  },

  methods: {
    init() {
      this.fillData();
      this.initChart();
      this.initScale();

      const svg = select("#_mechanism_chart");
      svg.attr("viewBox", [0, 0, this.width, this.height]).attr("style", "max-width: 100%; height: auto; height: intrinsic;").attr("font-family", "Mulish Bold").attr("font-size", "14px");
      // .on("touchstart", event => event.preventDefault())
      // .on("pointermove", pointermoved);

      svg.selectAll("*").remove();

      //#region defs

      var defs = svg.append("defs");
      var arrowMarker = defs
        .append("marker")
        .attr("id", "m-axisDot")
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

      //#endregion

      svg.append("rect").attr("id", "bg").attr("width", "100%").attr("height", "100%");

      this.initAxis();

      this.draw();

      svg.on("click", this.handleClick);
    },

    fillData() {
      const dailyLinesData = [];

      this.data.forEach(item => {
        const dailyData = {
          data: [
            { date: 0, value: 1 },
            { date: 1, value: getInvestByApy({ apyTiers: item.apys, principal: 1, compound: item.compound, days: 365 * 1 }).total },
            { date: 2, value: getInvestByApy({ apyTiers: item.apys, principal: 1, compound: item.compound, days: 365 * 2 }).total },
            { date: 3, value: getInvestByApy({ apyTiers: item.apys, principal: 1, compound: item.compound, days: 365 * 3 }).total },
            { date: 4, value: getInvestByApy({ apyTiers: item.apys, principal: 1, compound: item.compound, days: 365 * 4 }).total },
          ],
          compound: item.compound,
          color: item.color,
        };
        dailyLinesData.push(dailyData);
      });

      this.dailyLinesData = dailyLinesData;
    },

    initChart() {
      const marginRight = 14;

      this.chartArea = {
        bottomLeft: { x: this.widthes.axisDot, y: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot },
        size: {
          width: this.width - this.widthes.axisDot - this.widthes.axisDot - marginRight,
          height: this.height - this.widthes.xTickeValueArea - this.widthes.axisDot - this.widthes.axisDot,
        },
        marginRight,
      };
    },

    initScale() {
      const allData = this.dailyLinesData.map(d => d.data).flat();

      this.xScale = scaleLinear()
        .domain([Math.min(...allData.map(d => d.date)), Math.max(...allData.map(d => d.date))])
        .range([this.chartArea.bottomLeft.x, this.widthes.axisDot + this.chartArea.size.width]);
      this.xAxis = axisBottom(this.xScale)
        .ticks(4, null)
        .tickFormat(d => d + "Y")
        .tickSizeOuter(0)
        .tickSizeInner(0)
        .tickPadding(25);

      this.yScale = scaleLinear()
        .domain([Math.min(...allData.map(d => d.value)), Math.max(...allData.map(d => d.value))])
        .range([this.chartArea.bottomLeft.y, this.widthes.axisDot]);
      this.yAxis = axisRight(this.yScale).ticks(0, "").tickSizeOuter(0).tickSizeInner(0);
    },

    initAxis() {
      const svg = select("#_mechanism_chart");
      svg.classed("dark", this.dark);

      // x
      const axisX = svg
        .append("g")
        .attr("id", "axis-x")
        .attr("transform", `translate(${this.chartArea.bottomLeft.x}, ${this.widthes.axisDot + this.chartArea.size.height})`)
        .call(this.xAxis);
      axisX.selectAll(".tick").on("click", event => {
        const selected = parseInt(event.target.innerHTML.substring(0, 1));
        this.selectedIndex = selected;
        this.haldleSelection();
        this.$emit("axisXClick", selected);
      });
      axisX.select("path").attr("marker-end", "url(#m-axisDot)").attr("marker-start", "url(#axisDot)");
      axisX.selectAll(".tick").select("text");
      // 修正x轴两端刻度
      axisX.selectAll(`.tick:nth-child(6)`).attr("transform", `translate(${this.chartArea.bottomLeft.x + this.widthes.axisDot + this.chartArea.size.width - 10}, 0)`);
      axisX.selectAll(".tick:nth-child(2)").remove();

      // y
      const axisY = svg
        .append("g")
        .attr("id", "axis-y")
        .attr("transform", `translate(${this.chartArea.bottomLeft.x + this.widthes.axisDot + this.chartArea.size.width}, 0)`)
        .call(this.yAxis);
      axisY.select("path").attr("marker-end", "url(#m-axisDot)").attr("marker-start", "url(#axisDot)");

      // grid
      const grids = svg.append("g").attr("id", "grids");
      for (let i = 1; i < 4; i++) {
        grids
          .append("line")
          .attr("class", "grid")
          .attr("x1", this.chartArea.bottomLeft.x + this.xScale(i))
          .attr("y1", this.widthes.axisDot + this.chartArea.size.height)
          .attr("x2", this.chartArea.bottomLeft.x + this.xScale(i))
          .attr("y2", this.widthes.axisDot)
          // .attr("stroke", this.colors.axisLine)
          .attr("stroke-dasharray", "8,8")
          .attr("stroke-width", 1);
      }
    },

    draw() {
      this.myLine = line()
        .curve(curveCardinal)
        .x(d => this.xScale(d.date))
        .y(d => this.yScale(d.value));

      const svg = select("#_mechanism_chart");
      let root = svg.select("#lines");
      if (root.empty()) root = svg.append("g").attr("id", "lines");
      else root.selectAll("*").remove();

      this.dailyLinesData.forEach((d, i) => {
        root
          .append("path")
          .attr("id", `line-${i}`)
          .attr("fill", "none")
          .attr("stroke", d.color)
          .attr("stroke-width", 2)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .attr("stroke-opacity", 0.3)
          .attr("d", this.myLine(d.data));
      });
    },

    haldleSelection() {
      const svg = select("#_mechanism_chart");
      let root = select("#lines-selected");
      if (root.empty()) root = svg.append("g").attr("id", "lines-selected");
      else root.selectAll("*").remove();

      const selected = this.selectedIndex;
      if (selected < 0) return;

      this.dailyLinesData.forEach((d, i) => {
        const data = d.data.filter(m => m.date <= selected);
        root
          .append("path")
          .attr("id", `line-s-${i}`)
          .attr("fill", "none")
          .attr("stroke", d.color)
          .attr("stroke-width", 4)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .attr("stroke-opacity", 1)
          .attr("d", this.myLine(data));
      });
      //#endregion

      //#region axis x

      root = svg.select("#axis-x");
      root.select("#axis-x-selected-border").remove();
      const offset = selected === 4 ? -4 : 3;
      root
        .insert("rect", "g")
        .attr("id", "axis-x-selected-border")
        .attr("x", this.widthes.yTickeValueArea + (this.chartArea.size.width / 4) * selected - this.widthes.tickButtonWidth / 2 + offset)
        .attr("y", this.widthes.xTickeValueArea - this.widthes.tickButtonHeight - 4)
        .attr("width", this.widthes.tickButtonWidth)
        .attr("height", this.widthes.tickButtonHeight)
        .attr("rx", this.widthes.tickButtonHeight / 2)
        .attr("ry", this.widthes.tickButtonHeight / 2)
        .attr("stroke", "#925BCA")
        .attr("stroke-width", 1);

      root.selectAll(`.tick`).classed("tick-selected", false);
      root.selectAll(`.tick:nth-child(${2 + selected})`).classed("tick-selected", true);

      //#endregion
    },

    handleClick(event) {
      const svgLeft = this.$refs.chartSvg.getBoundingClientRect().left;
      const selected = Math.ceil(this.xScale.invert(event.x - svgLeft - this.chartArea.bottomLeft.x));
      if (selected < 1 || selected > 4) return;

      const svgTop = this.$refs.chartSvg.getBoundingClientRect().top;
      if (event.y >= svgTop + this.widthes.axisDot + this.chartArea.size.height) return;

      this.selectedIndex = selected;
      this.haldleSelection();
      this.$emit("axisXClick", selected);
    },
  },
  watch: {
    data() {
      this.init();
      this.haldleSelection();
    },
    dark() {
      this.init();
      this.haldleSelection();
    },
    selected: {
      handler(n, o) {
        if (n !== o) {
          this.init();
          this.selectedIndex = this.selected === undefined ? -1 : this.selected;
          this.haldleSelection();
        }
      },
    },
  },
};
</script>

<style lang="less">
#_mechanism_chart {
  #bg {
    fill: #ffffff;
  }
  #axis-x {
    .domain {
      stroke: #dddcea;
    }
    #axis-x-selected-border {
      fill: white;
    }
    .tick {
      text {
        font-family: "Mulish Bold";
        font-size: 14px;
        fill: #2c2236;
        cursor: pointer;
      }
    }
    .tick-selected {
      text {
        fill: #925bca;
      }
    }
  }
  #axis-y {
    .domain {
      stroke: #dddcea;
    }
  }
  #grids {
    .grid {
      stroke: #dddcea;
    }
  }

  &.dark {
    #bg {
      fill: #140b22;
    }
    #axis-x {
      .domain {
        stroke: #433b71;
      }
      #axis-x-selected-border {
        fill: #cb9ff7;
      }
      .tick {
        text {
          fill: #ffffff;
        }
      }
      .tick-selected {
        text {
          fill: #140b22;
        }
      }
    }
    #axis-y {
      .domain {
        stroke: #433b71;
      }
    }
    #grids {
      .grid {
        stroke: #433b71;
      }
    }
  }
}
</style>
