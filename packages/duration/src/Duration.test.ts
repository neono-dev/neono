import { Result } from "@neono/result";
import { describe, expect, it } from "vitest";
import { Duration } from "./Duration";
import { IntegerDivisionByZeroError } from "./errors/IntegerDivisionByZeroError";

describe("Duration", () => {
  it("should create a Duration object", () => {
    const duration = Duration.from({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
      milliseconds: 5,
    });

    expect(duration.inMilliseconds).toBe(93784005);
  });

  describe("getters", () => {
    const duration = Duration.from({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
      milliseconds: 5,
    });

    it("`inDays` should return complete days span", () => {
      expect(duration.inDays).toBe(1);
    });

    it("`inHours` should return complete hours span", () => {
      expect(duration.inHours).toBe(26);
    });

    it("`inMinutes` should return complete minutes span", () => {
      expect(duration.inMinutes).toBe(1563);
    });

    it("`inSeconds` should return complete seconds span", () => {
      expect(duration.inSeconds).toBe(93_784);
    });

    it("`inMilliseconds` should return complete milliseconds span", () => {
      expect(duration.inMilliseconds).toBe(93_784_005);
    });
  });

  it("`abs` should return absolute duration", () => {
    const duration = Duration.from({ hours: -2 });

    expect(Duration.abs(duration)).toStrictEqual(Duration.from({ hours: 2 }));
  });

  it("`abs` should not modify already positive value", () => {
    const duration = Duration.from({ hours: 2 });

    expect(Duration.abs(duration)).toBe(duration);
  });

  it("`difference` should return correct difference duration", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ minutes: 20 });

    expect(Duration.difference(d2)(d1)).toStrictEqual(Duration.from({ minutes: 40 }));
  });

  it("`toString` should return a correct string representation", () => {
    const duration = Duration.from({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
      milliseconds: 567,
    });

    expect(Duration.toString(duration)).toBe("26:03:04.567");
  });

  it("`inverse` should return a negative duration when initial is positive", () => {
    const duration = Duration.from({ days: 5 });

    expect(Duration.inverse(duration)).toStrictEqual(Duration.from({ days: -5 }));
  });

  it("`inverse` should return a positive duration when initial is negative", () => {
    const duration = Duration.from({ days: -5 });

    expect(Duration.inverse(duration)).toStrictEqual(Duration.from({ days: 5 }));
  });

  it("`add` should add two durations", () => {
    const d1 = Duration.from({ days: 5 });
    const d2 = Duration.from({ hours: 28 });
    const expectedResult = Duration.from({ days: 6, hours: 4 });

    expect(Duration.add(d2)(d1)).toStrictEqual(expectedResult);
  });

  it("`subtract` should subtract two durations", () => {
    const d1 = Duration.from({ days: 5 });
    const d2 = Duration.from({ hours: 28 });
    const expectedResult = Duration.from({ days: 3, hours: 20 });

    expect(Duration.subtract(d2)(d1)).toStrictEqual(expectedResult);
  });

  it("`multiply` should multiply by a given factor", () => {
    const d1 = Duration.from({ hours: 20 });
    const expectedResult = Duration.from({ days: 3, hours: 8 });

    expect(Duration.multiply(4)(d1)).toStrictEqual(expectedResult);
  });

  it("`divide` should divide by a given quotient", () => {
    const d1 = Duration.from({ hours: 20 });
    const expectedResult = Duration.from({ hours: 5 });

    expect(Duration.divide(4)(d1)).toStrictEqual(Result.Ok(expectedResult));
  });

  it("`divide` should return an error if quotient is zero", () => {
    const d1 = Duration.from({ hours: 20 });
    const expectedResult = Result.Err(new IntegerDivisionByZeroError());

    expect(Duration.divide(0)(d1)).toStrictEqual(expectedResult);
  });

  it("`isLesserThan` should return true", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isLesserThan(d2)(d1)).toBe(true);
  });

  it("`isLesserThan` should return false", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isLesserThan(d1)(d2)).toBe(false);
  });

  it("`isLesserThan` should return false if values are equal", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 1 });

    expect(Duration.isLesserThan(d1)(d2)).toBe(false);
  });

  it("`isGreaterThan` should return true", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isGreaterThan(d1)(d2)).toBe(true);
  });

  it("`isGreaterThan` should return false", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isGreaterThan(d2)(d1)).toBe(false);
  });

  it("`isGreaterThan` should return false if values are equal", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 1 });

    expect(Duration.isGreaterThan(d2)(d1)).toBe(false);
  });

  it("`isEqual` should return false if is lesser", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isEqual(d1)(d2)).toBe(false);
  });

  it("`isEqual` should return false if is greater", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isEqual(d2)(d1)).toBe(false);
  });

  it("`isEqual` should return true if values are equal", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 1 });

    expect(Duration.isEqual(d2)(d1)).toBe(true);
  });

  it("`isLesserThanOrEqual` should return true", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isLesserThanOrEqual(d2)(d1)).toBe(true);
  });

  it("`isLesserThanOrEqual` should return false", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isLesserThanOrEqual(d1)(d2)).toBe(false);
  });

  it("`isLesserThanOrEqual` should return true if values are equal", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 1 });

    expect(Duration.isLesserThanOrEqual(d1)(d2)).toBe(true);
  });

  it("`isGreaterThanOrEqual` should return true", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isGreaterThanOrEqual(d1)(d2)).toBe(true);
  });

  it("`isGreaterThanOrEqual` should return false", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 10 });

    expect(Duration.isGreaterThanOrEqual(d2)(d1)).toBe(false);
  });

  it("`isGreaterThanOrEqual` should return true if values are equal", () => {
    const d1 = Duration.from({ hours: 1 });
    const d2 = Duration.from({ hours: 1 });

    expect(Duration.isGreaterThanOrEqual(d2)(d1)).toBe(true);
  });
});
