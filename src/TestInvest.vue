<template>
  <div class="page">
    <h1>Invest Profit Simulator</h1>
    <div class="body">
      <div class="apy">
        <h2>
          Tiered APY
          <span>(min, max]</span>
        </h2>
        <div class="tier" v-for="(tier, i) in tieredApys" :key="i">
          Tier #{{ i + 1 }} min.
          <input type="text" v-model="tier.tier.min" />
          max.
          <input type="text" v-model="tier.tier.max" />
          APY
          <input type="text" v-model="tier.apy" />
        </div>
        <div class="compound">
          <input type="checkbox" v-model="compound" @change="handle" />
          Compound
        </div>
      </div>
      <div class="invest">
        <h2>Invest</h2>
        <div>
          <span>Principal</span>
          <input type="text" v-model="principal" />
        </div>
        <div>
          <span>Days</span>
          <input type="text" v-model="days" />
        </div>
        <div></div>
      </div>
      <div class="result">
        <h2>Result</h2>
        <div>
          <span>Rewards</span>
          <input type="text" readonly v-model="rewards" />
        </div>
        <div>
          <span>Total Amount</span>
          <input type="text" readonly v-model="total" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Decimal from "decimal.js";
import { randomRange, getRewardOneDay, getInvestByApy } from "./utils/utils";

export default {
  data() {
    return {
      tieredApys: [
        { tier: { min: 0, max: 100 }, apy: 0.1 },
        { tier: { min: 100, max: 1000 }, apy: 0.2 },
        { tier: { min: 1000, max: Number.MAX_VALUE }, apy: 0.5 },
      ],
      compound: true,
      principal: 1000,
      days: 365,
      rewards: 0,
      total: 0,
    };
  },
  mounted() {
    this.handle();
  },
  methods: {
    handle() {
      const result = getInvestByApy({ apyTiers: this.tieredApys, principal: Number(this.principal), days: Number(this.days), compound: this.compound });
      this.rewards = Decimal(result.rewards).toFixed(8, Decimal.ROUND_DOWN);
      this.total = Decimal(result.total).toFixed(8, Decimal.ROUND_DOWN);
    },
  },
  watch: {
    tieredApys() {
      this.handle();
    },
    compound() {
      this.handle();
    },
    principal() {
      this.handle();
    },
    days() {
      this.handle();
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  display: flex;
  flex-direction: column;
  h1 {
    font-size: 20px;
    font-weight: 700;
  }
  h2 {
    font-size: 18px;
    font-weight: 700;
    span {
      margin: 0 20px 0 5px;
      font-size: 14px;
      line-height: 18px;
      color: gray;
    }
  }
  .body {
    display: flex;
    flex-direction: row;
    .apy {
      margin-right: 20px;
    }
    .invest {
      margin-right: 20px;
      div {
        span {
          display: inline-block;
          width: 70px;
        }
      }
    }
    .result {
      div {
        span {
          display: inline-block;
          width: 106px;
        }
      }
    }
  }
}
</style>
