// const { abridgeNumber } = require("../utils/utils");
import { abridgeNumber, makeTicks } from "../utils/utils";

test("abridgeNumber: 0", () => {
  expect(abridgeNumber(0)).toBe("0");
});
test("abridgeNumber: 100", () => {
  expect(abridgeNumber(100)).toBe("100");
});
test("abridgeNumber: 12000", () => {
  expect(abridgeNumber(12000)).toBe("12K");
});
test("abridgeNumber: 12000000", () => {
  expect(abridgeNumber(12000000)).toBe("12M");
});
test("abridgeNumber: 12345", () => {
  expect(abridgeNumber(12345)).toBe("12.35K");
});
test("abridgeNumber: 123456", () => {
  expect(abridgeNumber(123456)).toBe("123.46K");
});
test("abridgeNumber: 12345678", () => {
  expect(abridgeNumber(12345678)).toBe("12.35M");
});
test("abridgeNumber: 0.1", () => {
  expect(abridgeNumber(0.1)).toBe("0.1");
});
test("abridgeNumber: 0.1234567", () => {
  expect(abridgeNumber(0.1234567)).toBe("0.12");
});
test("abridgeNumber: 123456.789", () => {
  expect(abridgeNumber(123456.789)).toBe("123.46K");
});
test("abridgeNumber: 1234567.8987", () => {
  expect(abridgeNumber(1234567.8987)).toBe("1.23M");
});
test("abridgeNumber: 0.1234, 2", () => {
  expect(abridgeNumber(0.1234, 2)).toBe("0.12");
});
test("abridgeNumber: 0.1, 2, 对一位小数取两位无效", () => {
  expect(abridgeNumber(0.1, 2)).toBe("0.1");
});

test("makeTicks: 1234567.8987", () => {
  const ticks = makeTicks(0, 353.8964758747434, 2);
  expect(abridgeNumber(ticks[0])).toBe("0");
  expect(abridgeNumber(ticks[1])).toBe("176.95");
  expect(abridgeNumber(ticks[2])).toBe("353.9");
});
