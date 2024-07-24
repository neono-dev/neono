import {afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { DateTime } from "./DateTime";
import { Duration } from "@neono/duration";
import { Result } from "@neono/result";
import {DateTimeInvalidateDateStringError} from "../errors/DateTimeInvalidateDateStringError";

describe("DateTime", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should create a DateTime object from now", () => {
    vi.setSystemTime(new Date("2024-07-22T01:23:45.678+00:00"));

    const now = DateTime.now();

    expect(now.__value).toBe(1721611425000)
  })

  describe("properties", () => {
    const dateTime = DateTime.from({
      year: 2024,
      month: 7,
      day: 8,
      hour: 20,
      minute: 10,
      second: 5,
      millisecond: 234
    })

    it("should return correct year", () => {
      expect(dateTime.year).toBe(2024)
    })

    it("should return correct month", () => {
      expect(dateTime.month).toBe(DateTime.JULY)
    })

    it("should return correct day", () => {
      expect(dateTime.day).toBe(8)
    })

    it("should return correct hour", () => {
      expect(dateTime.hour).toBe(20)
    })

    it("should return correct minute", () => {
      expect(dateTime.minute).toBe(10)
    })

    it("should return correct second", () => {
      expect(dateTime.second).toBe(5)
    })

    it("should return correct millisecond", () => {
      expect(dateTime.millisecond).toBe(234)
    })

    it("should return correct milliseconds since Epoch", () => {
      expect(dateTime.millisecondSinceEpoch).toBe(1720469405000)
    })

    it("should return correct time zone name", () => {
      expect(dateTime.timeZoneName).toBe("GMT")
    })

    it("should return correct week day", () => {
      expect(dateTime.weekDay).toBe(DateTime.MONDAY)
    })
  })

  it("should create a custom DateTime object", () => {
    const dateTime = DateTime.from({
      year: 2024,
      month: 7,
      day: 8,
    })

    expect(dateTime.__value).toBe(1720396800000)
  })

  it("should create a DateTime from milliseconds since Epoch", () => {
    const dateTime = DateTime.fromMillisecondsSinceEpoch(690681600000)

    expect(dateTime.__value).toBe(690681600000)
  })

  it("should parse correctly", () => {
    const dateTime = DateTime.parse("1991-11-21T00:00:00.000+00:00")

    expect(Result.unwrap(dateTime).__value).toBe(690681600000)
  })

  it("`toIso8601String` should return correct ISO-8601 string", () => {
    const moonLanding = Result.unwrap(DateTime.parse("1969-07-20T20:18:00"))

    expect(DateTime.toIso8601String(moonLanding)).toBe("1969-07-20T20:18:00.000Z")
  })

  it("`add` should add a duration", () => {
    const dateTime = DateTime.from({
      year: 2024,
      month: DateTime.JUNE,
      day: 24,
    })
    const duration = Duration.from({ days: 30 })

    const expectedDateTime = DateTime.from({
      year: 2024,
      month: DateTime.JULY,
      day: 24,
    })

    expect(DateTime.add(duration)(dateTime)).toStrictEqual(expectedDateTime)
  })

  it("`subtract` should subtract a duration", () => {
    const dateTime = DateTime.from({
      year: 2024,
      month: DateTime.JUNE,
      day: 24,
      hour: 23
    })
    const duration = Duration.from({ hours: 10 })

    const expectedDateTime = DateTime.from({
      year: 2024,
      month: DateTime.JUNE,
      day: 24,
      hour: 13
    })

    expect(DateTime.subtract(duration)(dateTime)).toStrictEqual(expectedDateTime)
  })

  it("`difference` should return a correct duration between two dates", () => {
    const dateTime = DateTime.from({
      year: 2024,
      month: DateTime.JUNE,
      day: 24,
      hour: 23
    })

    const other = DateTime.from({
      year: 2024,
      month: DateTime.JUNE,
      day: 24,
      hour: 13
    })

    const duration = Duration.from({ hours: -10 })

    expect(DateTime.difference(other)(dateTime)).toStrictEqual(duration)
  })

  describe("`isAfter`", () => {
    it("should return true when second date is before first one", () => {
      const d1 = DateTime.from({ year: 2024 })
      const d2 = DateTime.from({ year: 2023 })

      const result = DateTime.isAfter(d2)(d1)

      expect(result).toBe(true)
    })

    it("should return false when second date is after first one", () => {
      const d1 = DateTime.from({ year: 2023 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAfter(d2)(d1)

      expect(result).toBe(false)
    })

    it("should return false when second date is equal to the first one", () => {
      const d1 = DateTime.from({ year: 2024 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAfter(d2)(d1)

      expect(result).toBe(false)
    })
  })

  describe("`isAtSameMomentOrAfter`", () => {
    it("should return true when second date is before first one", () => {
      const d1 = DateTime.from({ year: 2024 })
      const d2 = DateTime.from({ year: 2023 })

      const result = DateTime.isAtSameMomentOrAfter(d2)(d1)

      expect(result).toBe(true)
    })

    it("should return false when second date is after first one", () => {
      const d1 = DateTime.from({ year: 2023 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAtSameMomentOrAfter(d2)(d1)

      expect(result).toBe(false)
    })

    it("should return false when second date is equal to the first one", () => {
      const d1 = DateTime.from({ year: 2024 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAtSameMomentOrAfter(d2)(d1)

      expect(result).toBe(true)
    })
  })

  describe("`isBefore`", () => {
    it("should return true when second date is after first one", () => {
      const d1 = DateTime.from({ year: 2023 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isBefore(d2)(d1)

      expect(result).toBe(true)
    })

    it("should return false when second date is after first one", () => {
      const d1 = DateTime.from({ year: 2023 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isBefore(d2)(d1)

      expect(result).toBe(true)
    })

    it("should return false when second date is equal to the first one", () => {
      const d1 = DateTime.from({ year: 2024 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isBefore(d2)(d1)

      expect(result).toBe(false)
    })
  })

  describe("`isAtSameMomentOrBefore`", () => {
    it("should return true when second date is after first one", () => {
      const d1 = DateTime.from({ year: 2023 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAtSameMomentOrBefore(d2)(d1)

      expect(result).toBe(true)
    })

    it("should return false when second date is after first one", () => {
      const d1 = DateTime.from({ year: 2023 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAtSameMomentOrBefore(d2)(d1)

      expect(result).toBe(true)
    })

    it("should return false when second date is equal to the first one", () => {
      const d1 = DateTime.from({ year: 2024 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAtSameMomentOrBefore(d2)(d1)

      expect(result).toBe(true)
    })
  })

  describe("`isAtSameMomentAs`", () => {
    it("should return true when second date is after first one", () => {
      const d1 = DateTime.from({ year: 2023 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAtSameMomentAs(d2)(d1)

      expect(result).toBe(false)
    })

    it("should return false when second date is after first one", () => {
      const d1 = DateTime.from({ year: 2023 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAtSameMomentAs(d2)(d1)

      expect(result).toBe(false)
    })

    it("should return false when second date is equal to the first one", () => {
      const d1 = DateTime.from({ year: 2024 })
      const d2 = DateTime.from({ year: 2024 })

      const result = DateTime.isAtSameMomentAs(d2)(d1)

      expect(result).toBe(true)
    })
  })

  describe("errors", () => {
    it("should return an error if parsing is going wrong", () => {
      const dateTime = DateTime.parse("invalid")

      expect(dateTime).toStrictEqual(Result.Err(new DateTimeInvalidateDateStringError({ input: "invalid" })))
    })
  })
})