<template>
  <div class="ring-chart-v2">
    <svg ref="svgRef" width="100%" height="100%" viewBox="0 0 200 200">
      <!-- 添加阴影滤镜定义 -->
      <defs>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.57421 0 0 0 0 0.356406 0 0 0 0 0.792014 0 0 0 0.2 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_445_6276" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_445_6276" result="shape" />
        </filter>
      </defs>
    </svg>

    <!-- 中间描述文字 -->
    <div class="ring-chart-v2-desc" :style="{ color: percentage === 0 ? bgRingColor : ringColor }">
      <slot>
        <!-- 默认内容 -->
        <div>
          <span>{{ `${(realtimeRate * 100).toFixed()}%` }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, useSlots } from "vue";
import { select, Selection } from "d3-selection";
import { arc, Arc } from "d3-shape";
import { interpolate, interpolateNumber } from "d3-interpolate";
import "d3-transition";
import { transition } from "d3-transition";
import { easeSinOut } from "d3-ease";

// 定义 D3 选择元素的类型
type D3Selection<T extends Element = SVGElement> = Selection<T, unknown, null, undefined>;

// 定义弧数据的接口
interface ArcDatum {
  endAngle: number;
  [key: string]: any; // 允许其他可能的属性
}

interface ClaudeRingChartProps {
  // 百分比，例如若显示 74% 则 percentage=0.75
  percentage?: number;
  radius?: number;
  thickness?: number;
  // gap的单位是角度
  gap?: number;
  animationDuration?: number;
  ringColor?: string;
  bgRingColor?: string;
  cornerRadius?: number;
  onTween?: (current: number) => void;
}

const props = withDefaults(defineProps<ClaudeRingChartProps>(), {
  // 数据环的百分比
  percentage: 0.75,
  // 环形的外半径，一般不用改，改完会导致 svg 内部留白
  radius: 100,
  thickness: 12,
  gap: 5,
  animationDuration: 1000,
  ringColor: "#8a56e2",
  bgRingColor: "#e6e6eb",
  // 环形两段的圆角弧度，=0为直角
  cornerRadius: 6,
});

const slots = useSlots();

// 暴露更新进度的方法
const updateProgress = (newPercentage: number) => {
  animateProgress();
};

defineExpose({
  updateProgress,
});

// 引用和状态
const svgRef = ref<SVGSVGElement | null>(null);
// 整个圆环，常量
const totalRadians = 2 * Math.PI;
// 创建弧生成器，考虑到gap的影响
const ringArc: Arc<any, ArcDatum> | null = arc<ArcDatum>()
  .innerRadius(props.radius - props.thickness)
  .outerRadius(props.radius)
  .cornerRadius(props.cornerRadius);
const bgringArc: Arc<any, ArcDatum> | null = arc<ArcDatum>()
  .innerRadius(props.radius - props.thickness)
  .outerRadius(props.radius)
  .cornerRadius(0);
const getRadiansByPercentage = (percentage: number) => percentage * totalRadians;
// 当前的百分比，动画执行期间会变化
const realtimeRate = ref(0);

/**
	•	【-Math.PI / 2】0 点钟方向（正上方）
 	•	【0】3 点钟方向
	•	【Math.PI / 2】6 点钟方向
	•	【Math.PI】9 点钟方向
 */
// gap 的弧度
const gapRadians = ref((props.gap * Math.PI) / 180);

// 监听 percentage 变化
watch(
  () => props.percentage,
  newRate => {
    if (newRate !== undefined) {
      console.log("percentage changed to:", newRate, "which is", newRate * 100, "%");
      animateProgress();
    }
  },
  { deep: true }
); // 添加 deep: true 以检测深层变化

// 计算实际使用的百分比值
const actualPercentage = computed(() => {
  return props.percentage * 100;
});

onMounted(() => {
  initializeChart();
});

const initializeChart = () => {
  if (!svgRef.value) {
    console.error("SVG reference is null");
    return;
  }

  // 创建SVG
  const svg = select(svgRef.value);

  // 创建一个组元素并移动到中心
  const g = svg.append("g").attr("transform", `translate(100, 100)`);

  // // 创建背景弧
  g
    .append("path")
    .attr("id", "elBgring")
    .datum({ startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 }) // 从-90度（正上方）开始
    .attr("d", d => bgringArc(d))
    .style("fill", props.bgRingColor) as D3Selection<SVGPathElement>;

  // 绘制进度弧
  g
    .append("path")
    .attr("id", "elRing")
    .datum({ startAngle: -Math.PI / 2, endAngle: -Math.PI / 2 }) // 初始状态：起点和终点相同，都在正上方
    .attr("d", d => ringArc(d))
    .style("fill", props.ringColor)
    .style("filter", "url(#shadow)") as D3Selection<SVGPathElement>;
};

const animateProgress = () => {
  // 计算目标角度
  const targetRadians = getRadiansByPercentage(props.percentage);

  const ringData = { startAngle: 0, endAngle: 0 };
  const bgData = { startAngle: 0, endAngle: 0 };
  const elRing = svgRef.value?.getElementById("elRing") as SVGAElement;
  select<SVGAElement, ArcDatum>(elRing).datum(ringData);
  const elBgring = svgRef.value?.getElementById("elBgring") as SVGAElement;
  select<SVGAElement, ArcDatum>(elBgring).datum(bgData);

  const fullInterpolate = interpolate(0, targetRadians);
  transition(Math.random().toString())
    .tween("progress", () => t => {
      const current = fullInterpolate(t);

      // ringData.endAngle = current;
      select<SVGAElement, ArcDatum>(elRing).datum({ startAngle: 0, endAngle: current }).attr("d", ringArc);

      if (props.percentage === 0 || props.percentage === 1) {
        bgData.startAngle = current;
        bgData.endAngle = Math.PI * 2;
      } else {
        bgData.startAngle = current + gapRadians.value;
        bgData.endAngle = Math.PI * 2 - gapRadians.value;
      }
      select<SVGAElement, ArcDatum>(elBgring)
        // .datum({ startAngle: current + gapRadians.value, endAngle: Math.PI * 2 - gapRadians.value })
        .attr("d", bgringArc);

      const currentPercent = current / (Math.PI * 2);

      // 需要显示默认内容时才需要此值
      if (!slots.default) realtimeRate.value = currentPercent;

      // 将实时的百分比传递到组件外部（自定义 text 时使用）
      if (props.onTween) props.onTween(currentPercent);
    })
    .ease(easeSinOut)
    .duration(props.animationDuration);
};
</script>

<style lang="less" scoped>
.ring-chart-v2 {
  position: relative;
  width: 100%;
  height: 100%;
}

.ring-chart-v2-desc {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: "Mulish Bold";
  font-size: 24px;
  text-align: center;
}

svg {
  width: 100%;
  height: 100%;
}
</style>
