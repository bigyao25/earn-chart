export const randomRange = (min: number, max: number, isRound = false) => {
  var range = max - min;
  var rand = Math.random();
  const increase = isRound ? Math.round(rand * range) : rand * range; // 是否四舍五入

  return min + increase;
};

type TieredApyItem = {
  tiered: { start: number; end: number };
  apy: number;
};
type GetProfitByApyOptions = {
  principal: number;
  apyTiers: TieredApyItem[];
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
    if (restPrincipal < t.tiered.end) {
      tierPrincipal = restPrincipal;
    } else {
      tierPrincipal = t.tiered.end - t.tiered.start;
    }

    reward += tierPrincipal * (t.apy / 365);
    restPrincipal = restPrincipal - (t.tiered.end - t.tiered.start);
  });
  return reward;
};

/**
 * 获取本息和
 * @param options principal: 本金；apyTiers: 阶梯利率；compound: 是否复利；days: 存入天数
 */
export const getProfitByApy = (options: GetProfitByApyOptions) => {
  const ops = { ...{ compound: false, days: 1 }, ...options } as Required<GetProfitByApyOptions>;

  let principal = ops.principal;
  let totalReward = 0;
  for (let d = 0; d < ops.days; d++) {
    const reward = getRewardOneDay(principal, ops.apyTiers);
    totalReward += reward;
    if (ops.compound) principal += reward;
  }

  return principal + totalReward;
};