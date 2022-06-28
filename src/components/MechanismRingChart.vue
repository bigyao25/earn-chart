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
    text: '75%'
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

      // const outerRadius = Math.min(this.width, this.height) / 2;
      // const myPie = pie()
      //   .padAngle(1 / 365)
      //   .sort(null)
      //   .value(i => i.radius)(this.arcData);
      // const myArc = arc()
      //   .innerRadius(outerRadius - 10)
      //   .outerRadius(outerRadius);

      // svg
      //   .append("g")
      //   .attr("stroke", "blue")
      //   .attr("stroke-width", 1)
      //   .attr("stroke-linejoin", "round")
      //   .selectAll("path")
      //   .data(myPie)
      //   .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
      //   .join("path")
      //   .attr("fill", d => d.color)
      //   .attr("d", myArc);

      var myArc = arc().innerRadius(90).outerRadius(100);
      var myPie = pie()(this.arcData.map(d => d.radius));

      const root = svg.append("g");
      root
        .selectAll("g")
        .data(myPie)
        .enter()
        .append("g")
        .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`)
        .append("path")
        .attr("d", d => {
          console.log(222, d);
          return myArc(d);
        })
        .attr("fill", (d, i) => {
          console.log(333, d, i);
          return "yellow";
        });
    },
    fillData() {
      const ranges = this.data.ranges.sort((x, y) => x.range.min - y.range.min);
      if (ranges[ranges.length - 1].range.max < 1) {
        ranges.push({ range: { min: ranges[ranges.length - 1].range.max, max: 1 }, color: "red" });
      }
      this.arcData = ranges.map(r => ({ radius: r.range.max - r.range.min, color: r.color }));
    },
  },
};
</script>

<style lang="less"></style>
