import type { DateTimeConstructionProps } from "../interfaces/DateTimeConstructionProps";
import type { Branded } from "@neono/brand";
import { Duration } from "@neono/duration";
import { Result } from "@neono/result";
import { DateTimeInvalidateDateStringError } from "../errors/DateTimeInvalidateDateStringError";

interface DateTimePublic {
  __value: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  millisecondSinceEpoch: number;
  timeZoneName: string;
  timeZoneOffset: Duration.Duration;
  weekDay: number;
}

type DateTime = Branded<DateTimePublic, "DateTime">;

function _dateToDateTime(date: Date): DateTime {
  return from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds(),
  });
}

function _dateFromDateTime(dateTime: DateTime): Date {
  return new Date(
    dateTime.year,
    dateTime.month - 1,
    dateTime.day,
    dateTime.hour,
    dateTime.minute,
    dateTime.second,
    dateTime.millisecond
  );
}

function now(): DateTime {
  return _dateToDateTime(new Date());
}

function from(options: DateTimeConstructionProps): DateTime {
  const date = new Date(
    options.year ?? 0,
    options.month ? options.month - 1 : 0,
    options.day ?? 0,
    options.hour ?? 0,
    options.minute ?? 0,
    options.second ?? 0
  );

  return {
    __value: date.valueOf(),
    year: options.year ?? 0,
    month: options.month ?? 0,
    day: options.day ?? 0,
    hour: options.hour ?? 0,
    minute: options.minute ?? 0,
    second: options.second ?? 0,
    millisecond: options.millisecond ?? 0,
    millisecondSinceEpoch: date.valueOf(),
    weekDay: date.getDay() === 0 ? 7 : date.getDay(),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    timeZoneName: date.toString().match(/([A-Z]{2,})/)![0],
  } as DateTime;
}

function fromMillisecondsSinceEpoch(millisecondsSinceEpoch: number): DateTime {
  const date = new Date(millisecondsSinceEpoch);

  return _dateToDateTime(date);
}

function parse(dateString: string): Result.Result<DateTime, Error> {
  if (isNaN(Date.parse(dateString))) {
    return Result.Err(new DateTimeInvalidateDateStringError({ input: dateString }));
  }

  return Result.Ok(fromMillisecondsSinceEpoch(Date.parse(dateString)));
}

function isAfter(other: DateTime) {
  return function (self: DateTime): boolean {
    return self.__value > other.__value;
  };
}

function isAtSameMomentOrAfter(other: DateTime) {
  return function (self: DateTime): boolean {
    return self.__value >= other.__value;
  };
}

function isBefore(other: DateTime) {
  return function (self: DateTime): boolean {
    return self.__value < other.__value;
  };
}

function isAtSameMomentOrBefore(other: DateTime) {
  return function (self: DateTime): boolean {
    return self.__value <= other.__value;
  };
}

function isAtSameMomentAs(other: DateTime) {
  return function (self: DateTime): boolean {
    return self.__value === other.__value;
  };
}

function toIso8601String(self: DateTime) {
  const asDate = _dateFromDateTime(self);

  return asDate.toISOString();
}

function add(duration: Duration.Duration) {
  return function (self: DateTime): DateTime {
    return fromMillisecondsSinceEpoch(
      self.millisecondSinceEpoch + duration._milliseconds
    );
  };
}

function subtract(duration: Duration.Duration) {
  return function (self: DateTime): DateTime {
    return fromMillisecondsSinceEpoch(
      self.millisecondSinceEpoch - duration._milliseconds
    );
  };
}

function difference(other: DateTime) {
  return function (self: DateTime): Duration.Duration {
    return Duration.from({ milliseconds: other.__value - self.__value });
  };
}

export const DateTime = {
  now,
  from,
  fromMillisecondsSinceEpoch,
  parse,
  isAfter,
  isBefore,
  isAtSameMomentOrAfter,
  isAtSameMomentOrBefore,
  isAtSameMomentAs,
  toIso8601String,
  add,
  subtract,
  difference,

  // Constants
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,

  JANUARY: 1,
  FEBRUARY: 2,
  MARCH: 3,
  APRIL: 4,
  MAY: 5,
  JUNE: 6,
  JULY: 7,
  AUGUST: 8,
  SEPTEMBER: 9,
  OCTOBER: 10,
  NOVEMBER: 11,
  DECEMBER: 12,
};
