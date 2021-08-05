import { computeAvailableWeekdays } from "../../src/helpers/calendarHelper";

describe("computeAvailableWeekdays()", () => {
  describe("Post Conditions", () => {
    test("Happy path", () => {

      expect(computeAvailableWeekdays("sunday", "saturday")).toEqual([
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ]);

      expect(computeAvailableWeekdays("wednesday", "friday")).toEqual([
        "wednesday",
        "thursday",
        "friday"
      ]);

      expect(computeAvailableWeekdays("monday", "wednesday")).toEqual([
        "monday",
        "tuesday",
        "wednesday"
      ]);
    });
  });

  test("Crossed ranges", () => {
    expect(computeAvailableWeekdays("monday", "sunday")).toEqual([]);
    expect(computeAvailableWeekdays("wednesday", "tuesday")).toEqual([]);
    expect(computeAvailableWeekdays("friday", "monday")).toEqual([]);
    expect(computeAvailableWeekdays("saturday", "sunday")).toEqual([]);
  });
});
