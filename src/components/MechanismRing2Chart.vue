<template>
  <div class="chart relative">
    <svg :id="svgId" :height="height" :width="width" :viewBox="`0 0 ${width} ${height}`" class="_mr2_chart"></svg>
  </div>
</template>

<script>
import { select } from "d3-selection";

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
    svgId: { type: String, default: "_mr2_chart" },
    height: { type: Number, default: 400 },
    width: { type: Number, default: 500 },
    data: Object,
    dark: { type: Boolean, default: false },
  },
  data() {
    return {
      strokeWidth: 5,
    };
  },
  created() {},
  mounted() {
    console.log("mounted");
    this.init();
    this.change();
  },
  methods: {
    init() {
      const svg = select(`#${this.svgId}`);
      svg.classed("dark", this.dark);

      svg.selectAll("*").remove();

      svg.append("rect").attr("id", "bg").attr("width", "100%").attr("height", "100%");

      if (this.data?.ranges.length === 0) return;
      for (let i = 0; i < this.data?.ranges.length; i++) {
        const range = this.data?.ranges[i];

        let linecap;
        if (range.color === this.data.defaultColor) {
          linecap = "none";
        } else {
          linecap = "round";
        }

        svg
          .append("circle")
          .attr("id", `bar-range-${i}`)
          .attr("class", "bar-range")
          .attr("cx", this.width / 2)
          .attr("cy", this.height / 2)
          .attr("r", this.radius)
          .attr("transform", `rotate(-90, ${this.width / 2}, ${this.height / 2})`)
          .attr("fill", "none")
          .attr("stroke", this.data.defaultColor)
          .attr("stroke-width", this.strokeWidth)
          .attr("stroke-linecap", linecap)
          // .attr("style", `transition-delay: ${i}s`)
          .attr("transition-delay", `${i}s`);
      }
    },
    change() {
      console.log("change");
      if (this.data?.ranges.length === 0) return;
      for (let i = 0; i < this.data?.ranges.length; i++) {
        const range = this.data?.ranges[i];

        const dashoffset = this.circumference * range.range.min + this.circumference / 365;
        let dashlength = this.circumference * (range.range.max - range.range.min) - this.strokeWidth - (this.circumference / 365) * 2;
        if (range.color === this.data.defaultColor) {
          dashlength = this.circumference * (range.range.max - range.range.min) - this.strokeWidth - this.circumference / 365;
        } else {
          dashlength = this.circumference * (range.range.max - range.range.min) - this.strokeWidth - (this.circumference / 365) * 2;
        }

        const svg = select(`#${this.svgId}`);
        svg
          .select(`#bar-range-${i}`)
          .attr("stroke", range.color)
          .attr("stroke-dasharray", `${dashlength} ${this.circumference}`)
          .attr("stroke-dashoffset", dashoffset * -1);
      }
    },
  },
  computed: {
    radius() {
      return Math.min(this.width, this.height) / 2 - this.strokeWidth / 2;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
  },
  watch: {
    data() {
      console.log("watch:data");
      this.init();
      this.$forceUpdate();
      // this.$nextTick(() => {
      //   this.change();
      // });
      setTimeout(() => {
        this.change();
      }, 1000);
      // this.change();
    },
    dark() {
      this.change();
    },
  },
};
</script>

<style lang="less">
.chart {
  ._mr2_chart {
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
  .bar-range {
    // transition: stroke-dasharray 1s ease;
    transition-duration: 3s;
    /*     以下三值为默认值，稍后会详细介绍 */
    transition-property: stroke-dashoffset;
    transition-timing-function: ease;

    // transition: stroke-dashoffset 1s ease;
    // transition: all 1s ease;
  }
}
</style>
