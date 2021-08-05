import { allowedTimeToCssGridLabel, computeAvailableTimes, computeAvailableWeekdays, dateToAllowedTime, dateToWeekday } from "../../src/helpers/calendarHelper";

describe("computeAvailableWeekdays()", () => {
  describe("Post Conditions", () => {
    test("Common cases", () => {

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

describe("computeAvailableTimes()", () => {
  describe("Post Conditions", () => {

    test("Common cases", () => {
      expect(computeAvailableTimes("02:30", "07:30")).toEqual([
        "02:30",
        "03:00",
        "03:30",
        "04:00",
        "04:30",
        "05:00",
        "05:30",
        "06:00",
        "06:30",
        "07:00",
        "07:30"
      ]);
    });

    test("Crossed ranges", () => {
      expect(computeAvailableTimes("07:30", "03:00")).toEqual([]);
      expect(computeAvailableTimes("23:30", "00:00")).toEqual([]);
      expect(computeAvailableTimes("12:00", "00:30")).toEqual([]);
    });
  });
});

describe("allowedTimeToCssGridLabel()", () => {
  describe("Post Conditions", () => {
    test("Happy path", () => {
      expect(allowedTimeToCssGridLabel("05:30")).toBe("time0530");
    });
  });
});

describe("dateToAllowedTime()", () => {
  describe("Post Conditions", () => {
    test("Happy path", () => {
      expect(dateToAllowedTime("2021-08-05T23:03:07.177Z")).toBe("23:03");
    });
  });
});

describe("dateToWeekday()", () => {
  describe("Post Conditions", () => {
    test("Happy path", () => {
      expect(dateToWeekday("2021-08-01T23:03:07.177Z")).toBe("sunday");
      expect(dateToWeekday("2021-08-02T23:03:07.177Z")).toBe("monday");
      expect(dateToWeekday("2021-08-03T23:03:07.177Z")).toBe("tuesday");
      expect(dateToWeekday("2021-08-04T23:03:07.177Z")).toBe("wednesday");
      expect(dateToWeekday("2021-08-05T23:03:07.177Z")).toBe("thursday");
      expect(dateToWeekday("2021-08-06T23:03:07.177Z")).toBe("friday");
      expect(dateToWeekday("2021-08-07T23:03:07.177Z")).toBe("saturday");
    });
  });
});