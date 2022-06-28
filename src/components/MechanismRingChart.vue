<template>
  <div class="chart relative">
    <svg id="_mr_chart" :height="height" :width="width"></svg>
  </div>
</template>

<script>
import { select } from "d3-selection";
import { arc, pie } from "d3-shape";
/**
 *
  data: {
    ranges: [
      {range: [min: 0, max: .75], color: 'purple'},
      {range: [min: 0.75, max: 1], color: 'gray'}
    ],
    text: '75%',
    defaultColor: gray
  }
 */
export default {
  props: {
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

      const svg = select("#_mr_chart");
      svg.classed("dark", this.dark);

      svg.selectAll("*").remove();

      // var defs = svg.append("defs");
      // var filter = defs.append("filter").attr("id", "dropshadow");
      // filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 4).attr("result", "blur");
      // filter.append("feOffset").attr("in", "blur").attr("dx", 0).attr("dy", 0).attr("result", "offsetBlur");
      // filter.append("feFlood").attr("in", "offsetBlur").attr("flood-color", "#925BCA").attr("flood-opacity", "0.5").attr("result", "offsetColor");
      // filter.append("feComposite").attr("in", "offsetColor").attr("in2", "offsetBlur").attr("operator", "in").attr("result", "offsetBlur");
      // var feMerge = filter.append("feMerge");
      // feMerge.append("feMergeNode").attr("in", "offsetBlur");
      // feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      var myArc = arc()
        .innerRadius(Math.min(this.width, this.height) / 2 - 6)
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
      // .attr("filter", "url(#dropshadow)");

      if (this.data.info?.text) {
        root
          .append("text")
          .text(this.data.info.text)
          .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", 24)
          .attr("fill", this.data.info.color);
      }
    },
    fillData() {
      const ranges = this.data.ranges.sort((x, y) => x.range.min - y.range.min);
      if (ranges[ranges.length - 1].range.max < 1) {
        ranges.push({ range: { min: ranges[ranges.length - 1].range.max, max: 1 }, color: "red" });
      }
      this.arcData = ranges.map(r => ({ radius: r.range.max - r.range.min, color: r.color }));
    },
  },
  watch: {
    data() {
      this.init();
    },
  },
};
</script>

<style lang="less">
#_mr_chart {
  text {
    font-family: Mulish Bold;
    letter-spacing: -1.5;
  }
}
</style>
