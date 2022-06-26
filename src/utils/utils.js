export const randomRange = (min, max, isRound = false) => {
  var range = max - min;
  var rand = Math.random();
  const increase = isRound ? Math.round(rand * range) : rand * range; // 是否四舍五入

  return min + increase;
};

export const getProfitByApy = (principal, apy, compond = false, days = 1) => {};
