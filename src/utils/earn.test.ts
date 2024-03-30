import { getRewardOneDay, getInvestByApy } from "./utils";

test("getRewardOneDay: 0", () => {
  const reward = getRewardOneDay(10000, [{ tier: { min: 0, max: 999999 }, apy: 0.1 }]);
  expect(Math.abs(reward - 2.739726027396)).toBeLessThan(0.00000000001);
});

test("getRewardOneDay: 1", () => {
  const reward = getRewardOneDay(10000, [
    { tier: { min: 0, max: 100 }, apy: 0.2 },
    { tier: { min: 100, max: 999999 }, apy: 0.1 },
  ]);
  // tier1: 0.054794520548
  // tier2: 2.712328767123
  expect(Math.abs(reward - 0.054794520548 - 2.712328767123)).toBeLessThan(0.00000000001);
});

test("getRewardOneDay: 2", () => {
  const reward = getRewardOneDay(10000, [
    { tier: { min: 0, max: 100 }, apy: 0.5 },
    { tier: { min: 100, max: 1000 }, apy: 0.2 },
    { tier: { min: 1000, max: 999999 }, apy: 0.1 },
  ]);
  // tier1: 0.136986301370
  // tier2: 0.493150684932
  // tier3: 2.465753424658
  expect(Math.abs(reward - 0.13698630137 - 0.493150684932 - 2.465753424658)).toBeLessThan(0.00000000001);
});

test("getInvestByApy: 0", () => {
  const res = getInvestByApy({
    principal: 10000,
    apyTiers: [
      { tier: { min: 0, max: 100 }, apy: 0.5 },
      { tier: { min: 100, max: 1000 }, apy: 0.2 },
      { tier: { min: 1000, max: 999999 }, apy: 0.1 },
    ],
    days: 365,
  });

  expect(Math.abs(res.rewards - 1129.999999999996)).toBeLessThan(0.00000000001);
  expect(Math.abs(res.total - 11129.999999999996)).toBeLessThan(0.00000000001);
});

test("getInvestByApy: 1", () => {
  const res = getInvestByApy({
    principal: 10000,
    apyTiers: [
      { tier: { min: 0, max: 100 }, apy: 0.5 },
      { tier: { min: 100, max: 1000 }, apy: 0.2 },
      { tier: { min: 1000, max: 999999 }, apy: 0.1 },
    ],
    compound: true,
    days: 365,
  });

  expect(Math.abs(res.rewards - 1188.2603322637883)).toBeLessThan(0.00000000001);
  expect(Math.abs(res.total - 11188.2603322637883)).toBeLessThan(0.00000000001);
});
