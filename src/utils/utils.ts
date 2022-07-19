export const randomRange = (min: number, max: number, isRound = false) => {
  var range = max - min;
  var rand = Math.random();
  const increase = isRound ? Math.round(rand * range) : rand * range; // 是否四舍五入

  return min + increase;
};

type TieredApyItem = {
  tier: { min: number; max: number };
  apy: number;
};
type GetProfitByApyOptions = {
  apyTiers: TieredApyItem[];
  principal: number;
  compound?: boolean;
  days?: number;
};

/**
 * 数字缩写(10000->10K, 1000000->1M)
 * @param num 待转换数字
 * @param digits 保留小数位数
 */
export function abridgeNumber(num: number, digits: number = 2) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

/**
 * 获取单日利息
 * @param principal 本金
 * @param apyTiers 阶梯利率
 */
export const getRewardOneDay = (principal: number, apyTiers: TieredApyItem[]) => {
  let restPrincipal = principal;
  let reward = 0;
  apyTiers.forEach(t => {
    if (restPrincipal <= 0) return false;

    let tierPrincipal;
    if (restPrincipal <= t.tier.max - t.tier.min) {
      tierPrincipal = restPrincipal;
    } else {
      tierPrincipal = t.tier.max - t.tier.min;
    }

    reward += tierPrincipal * (t.apy / 365);
    restPrincipal = restPrincipal - (t.tier.max - t.tier.min);
  });
  return reward;
};

/**
 * 获取本息和
 * @param options principal: 本金；apyTiers: 阶梯利率；compound: 是否复利；days: 存入天数
 */
export const getInvestByApy = (options: GetProfitByApyOptions) => {
  const ops = { ...{ compound: false, days: 1 }, ...options } as Required<GetProfitByApyOptions>;

  let principal = ops.principal;
  let totalReward = 0;
  for (let d = 0; d < ops.days; d++) {
    const reward = getRewardOneDay(principal, ops.apyTiers);
    totalReward += reward;
    if (ops.compound) principal += reward;
  }

  return { rewards: totalReward, total: ops.principal + totalReward };
};

/**
 * 获取每日本息和
 * @param options principal: 本金；apyTiers: 阶梯利率；compound: 是否复利；days: 存入天数
 * @returns dailyRewards: 当日收益；totalRewards: 累计收益；total: 当日本息和。
 */
export const getDailyInvestByApy = function (options: GetProfitByApyOptions) {
  const ops = { ...{ compound: false, days: 1 }, ...options } as Required<GetProfitByApyOptions>;

  var result = [];
  var principal = ops.principal;
  var totalReward = 0;
  for (var d = 0; d < ops.days; d++) {
    const reward = getRewardOneDay(principal, ops.apyTiers);
    totalReward += reward;
    // compound
    if (ops.compound) principal += reward;
    // daily result
    result.push({ dailyRewards: reward, totalRewards: totalReward, total: ops.principal + totalReward });
  }

  return result;
};

/**
 * 根据存入数量(本金)计算阶梯利率的平均年化
 * @param options principal: 本金；apyTiers: 阶梯利率；compound: 是否复利；days: 存入天数
 * @returns 年华收益
 */
export const getAvgApyByApyTiers = function (options: GetProfitByApyOptions) {
  //  金额小于第一阶段的直接返回第一阶段的收益率
  if (+options.principal <= +options.apyTiers[0].tier.max) {
    return (options.apyTiers[0].apy * 100).toFixed(2);
  }
  var rewards = getInvestByApy(options).rewards;
  return ((rewards / options.principal) * 100).toFixed(2);
};
