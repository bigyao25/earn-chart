export const randomRange = (min: number, max: number, isRound = false) => {
  var range = max - min;
  var rand = Math.random();
  const increase = isRound ? Math.round(rand * range) : rand * range; // 是否四舍五入

  return min + increase;
};

type TieredApyItem = {
  tiered: { min: number; max: number };
  apy: number;
};
type GetProfitByApyOptions = {
  apyTiers: TieredApyItem[];
  principal: number;
  compound?: boolean;
  days?: number;
};

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
    if (restPrincipal <= t.tiered.max - t.tiered.min) {
      tierPrincipal = restPrincipal;
    } else {
      tierPrincipal = t.tiered.max - t.tiered.min;
    }

    reward += tierPrincipal * (t.apy / 365);
    restPrincipal = restPrincipal - (t.tiered.max - t.tiered.min);
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
