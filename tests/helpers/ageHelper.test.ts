import { computeCurrentAge } from "../../src/helpers/ageHelper";
import Mockdate from "mockdate";

beforeAll(() => {
  Mockdate.set("2021-08-05");
});

describe("computeCurrentAge()", () => {
  describe("Post Conditions", () => {
    test("Common cases", () => {
      expect(computeCurrentAge("1995-06-19")).toBe(26);
      expect(computeCurrentAge("1990-06-27")).toBe(31);
      expect(computeCurrentAge("1999-10-19")).toBe(21);
      expect(computeCurrentAge("2021-01-19")).toBe(0);
    });

    test("Same day, different years", () => {
      expect(computeCurrentAge("2020-08-05")).toBe(1);
      expect(computeCurrentAge("2019-08-05")).toBe(2);
      expect(computeCurrentAge("2018-08-05")).toBe(3);
      expect(computeCurrentAge("2017-08-05")).toBe(4);
    });

    test("February 29th", () => {
      expect(computeCurrentAge("2020-02-29")).toBe(1);
    });
  });
});