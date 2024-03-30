import { formatDomain } from "./strings";

test("formatDomain", () => {
  expect(formatDomain("abc.com")).toBe("abc.com");
  expect(formatDomain("abc.com/a")).toBe("abc.com");
  expect(formatDomain("http://abc.net")).toBe("abc.net");
  expect(formatDomain("https://a-bc.io")).toBe("a-bc.io");
  expect(formatDomain("https://a_bc.plus")).toBe("a_bc.plus");
  expect(formatDomain("https://Abc.co/100")).toBe("Abc.co");
});
