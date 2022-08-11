<template>
  <div class="chart relative">
    <svg :id="svgId" :height="height" :width="width" class="_mr_chart"></svg>
  </div>
</template>

<script>
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";
import { interpolateNumber } from "d3-interpolate";
import { format } from "d3-format";
import { active } from "d3-transition";
/**
 *
      data: {
        ranges: [
          { range: { min: 0, max: 0.75 }, color: "#925BCA" },
          { range: { min: 0.75, max: 1 }, color: "#DDDCEA" },
        ],
        info: { text: 0.75, color: "#925BCA" },
        defaultColor: "#DDDCEA",
      },
 */
export default {
  props: {
    svgId: { type: String, default: "_mr_chart" },
    height: { type: Number, default: 400 },
    width: { type: Number, default: 500 },
    data: Object,
    dark: { type: Boolean, default: false },
  },
  data() {
    return {
      arcData: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.fillData();

      const svg = select(`#${this.svgId}`);
      console.log(svg);
      svg.classed("dark", this.dark);

      svg.selectAll("*").remove();

      svg.append("rect").attr("id", "bg").attr("width", "100%").attr("height", "100%");

      var myArc = arc()
        .innerRadius(Math.min(this.width, this.height) / 2 - 5)
        .outerRadius(Math.min(this.width, this.height) / 2)
        .cornerRadius(d => {
          return d.data.color === this.data.defaultColor ? 0 : 5;
        });
      var myPie = pie()
        .padAngle(15 / 365)
        .value(d => d.radius)(this.arcData);

      const root = svg.append("g");
      root
        .selectAll("g")
        .data(myPie)
        .enter()
        .append("path")
        .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
        .attr("d", d => myArc(d))
        .attr("fill", d => d.data.color);

      if (this.data.info?.text !== undefined) {
        const num = this.data.info?.text;
        root
          .append("text")
          .attr("y", 2)
          .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", 24)
          .attr("fill", this.data.info.color)
          .transition()
          .duration(300)
          .on("start", function () {
            active(this).tween("text", () => t => {
              select(this).text(format(".0%")(interpolateNumber(0, num)(t)));
            });
          });
      }
    },
    fillData() {
      const ranges = this.data.ranges.sort((x, y) => x.range.min - y.range.min);
      if (ranges[ranges.length - 1].range.max < 1) {
        ranges.push({ range: { min: ranges[ranges.length - 1].range.max, max: 1 }, color: "#DDDCEA" });
      }
      this.arcData = ranges.map(r => ({ radius: r.range.max - r.range.min, color: r.color }));
    },
  },
  watch: {
    data() {
      this.init();
    },
    dark() {
      this.init();
    },
  },
};
</script>

<style lang="less">
.chart {
  ._mr_chart {
    #bg {
      fill: rgba(255, 255, 255, 0);
    }
    text {
      font-family: Mulish Bold;
      letter-spacing: -0.015em;
    }

    &.dark {
      #bg {
        fill: rgba(255, 255, 255, 0);
      }
    }
  }
}
</style>
