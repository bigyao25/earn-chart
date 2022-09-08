<template>
  <div class="progress-container">
    <!-- 第一个圆环 -->
    <div class="progress-box">
      <my-ring-chart :rate="rate1" ring-color="#409EFF" stroke-linecap="inherit" :stroke-width="14" bg-ring-color="#ccc">
        <span>
          <span>{{ `${(rate1 * 100).toFixed(2)}%` }}</span>
        </span>
      </my-ring-chart>
    </div>
    <!-- 第二个圆环 -->
    <div class="progress-box">
      <my-ring-chart :rate="rate2" ring-color="#67C23A" stroke-linecap="round" :stroke-width="18" bg-ring-color="orange">
        <span>
          <span>{{ `${(rate2 * 100).toFixed(2)}%` }}</span>
          <br />
          <span>进度条</span>
        </span>
      </my-ring-chart>
    </div>
    <!-- 第三个圆环 -->
    <div class="progress-box">
      <my-ring-chart :rate="rate3" ring-color="#E6A23C" stroke-linecap="butt" :stroke-width="22">
        <span>
          <i style="color: #e6a23c" class="el-icon-warning"></i>
          <br />
          <span>{{ `${(rate2 * 100).toFixed(2)}%` }}</span>
        </span>
      </my-ring-chart>
    </div>
    <!-- 第四个圆环 -->
    <div class="progress-box">
      <my-ring-chart :rate="rate4" ring-color="#F56C6C" stroke-linecap="butt" :stroke-width="26">
        <span>
          <i style="color: #f56c6c" class="el-icon-close"></i>
          <br />
          <span>{{ `${(rate4 * 100).toFixed(2)}%` }}</span>
        </span>
      </my-ring-chart>
    </div>
    <!-- 第五个圆环 -->
    <div class="progress-box">
      <my-ring-chart :rate="rate5" ring-color="#909399" stroke-linecap="round" :stroke-width="14">
        <span>
          <span>{{ `${(rate5 * 100).toFixed(2)}%` }}</span>
          <br />
          <span>圆环</span>
        </span>
      </my-ring-chart>
    </div>
    <!-- 第六个圆环 -->
    <div class="progress-box">
      <my-ring-chart :rate="rate2" ring-color="orange" stroke-linecap="round" :stroke-width="18">
        <span>
          <span>{{ `${(rate2 * 100).toFixed(2)}%` }}</span>
          <br />
          <span></span>
        </span>
      </my-ring-chart>
    </div>
  </div>
</template>
<script>
import MyRingChart from "./components/MyRingChart.vue";

export default {
  name: "ProgressBox",
  components: { MyRingChart },
  data() {
    return {
      rate1: Math.random(),
      rate2: Math.random(),
      rate3: Math.random(),
      rate4: Math.random(),
      rate5: Math.random(),
      Timer: null,
    };
  },
  mounted() {
    this.Timer = setInterval(() => {
      for (let i = 1; i <= 5; i++) {
        this[`rate${i}`] = Math.random();
      }
    }, 5000);
  },
  beforeDestroy() {
    if (this.Timer) {
      clearInterval(this.Timer);
      this.Timer = null;
    }
  },
};
</script>
<style scoped>
.progress-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  stroke-dashoffset: 0;
}
.progress-box {
  width: 100px;
  /* height: 30%; */
  padding: 10px;
}
</style>
