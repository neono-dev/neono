import {DurationConstructor} from "./interfaces/DurationConstructor";
import {Result} from "@neono/result";
import {IntegerDivisionByZeroError} from "./errors/IntegerDivisionByZeroError";

export namespace Duration {
  export interface Duration {
    _milliseconds: number;
    inDays: number;
    inHours: number;
    inMinutes: number;
    inSeconds: number;
    inMilliseconds: number;
    isNegative: boolean;
  }
}

function _getDaysSpan(milliseconds: number): number {
  return Math.floor(milliseconds / Duration.MILLISECONDS_PER_DAY);
}

function _getHoursSpan(milliseconds: number): number {
  return Math.floor(milliseconds / Duration.MILLISECONDS_PER_HOUR);
}

function _getMinutesSpan(milliseconds: number): number {
  return Math.floor(milliseconds / Duration.MILLISECONDS_PER_MINUTE);
}

function _getSecondsSpan(milliseconds: number): number {
  return Math.floor(milliseconds / Duration.MILLISECONDS_PER_SECOND);
}

function _milliseconds(milliseconds: number): Duration.Duration {
  return {
    _milliseconds: milliseconds,
    inDays: _getDaysSpan(milliseconds),
    inHours: _getHoursSpan(milliseconds),
    inMinutes: _getMinutesSpan(milliseconds),
    inSeconds: _getSecondsSpan(milliseconds),
    inMilliseconds: milliseconds,
    isNegative: milliseconds < 1,
  }
}

function from(obj: DurationConstructor): Duration.Duration {
  return _milliseconds(
    Duration.MILLISECONDS_PER_DAY * (obj.days ?? 0) +
    Duration.MILLISECONDS_PER_HOUR * (obj.hours ?? 0) +
    Duration.MILLISECONDS_PER_MINUTE * (obj.minutes ?? 0) +
    Duration.MILLISECONDS_PER_SECOND * (obj.seconds ?? 0) +
    (obj.milliseconds ?? 0)
  )
}

function abs(self: Duration.Duration): Duration.Duration {
  if (self.isNegative) return _milliseconds(self._milliseconds * -1)
  return self;
}

function difference(other: Duration.Duration) {
  return function (self: Duration.Duration): Duration.Duration {
    return _milliseconds(self._milliseconds - other._milliseconds)
  }
}

function toString(self: Duration.Duration): string {
  const hours = self.inHours;
  const minutes = Math.floor(self.inMinutes % 60);
  const seconds = Math.floor(self.inSeconds % 60);
  const milliseconds = Math.floor(self.inMilliseconds % 1000);

  const hoursStr = String(hours).padStart(2, "0")
  const minutesStr = String(minutes).padStart(2, "0")
  const secondsStr = String(seconds).padStart(2, "0")
  const millisecondsStr = String(milliseconds).padStart(3, "0")

  return `${hoursStr}:${minutesStr}:${secondsStr}.${millisecondsStr}`
}

function inverse(self: Duration.Duration): Duration.Duration {
  return _milliseconds(-self._milliseconds)
}

function add(other: Duration.Duration) {
  return function (self: Duration.Duration): Duration.Duration {
    return _milliseconds(self._milliseconds + other._milliseconds)
  }
}

function subtract(other: Duration.Duration) {
  return function (self: Duration.Duration): Duration.Duration {
    return _milliseconds(self._milliseconds - other._milliseconds)
  }
}

function multiply(factor: number) {
  return function (self: Duration.Duration): Duration.Duration {
    return _milliseconds(self._milliseconds * factor)
  }
}

function divide(quotient: number) {
  return function (self: Duration.Duration): Result.Result<Duration.Duration, IntegerDivisionByZeroError> {
    if (quotient === 0) {
      return Result.Err(new IntegerDivisionByZeroError())
    }

    return Result.Ok(_milliseconds(self._milliseconds / quotient));
  }
}

function isLesserThan(other: Duration.Duration) {
  return function (self: Duration.Duration) {
    return self._milliseconds < other._milliseconds;
  }
}

function isGreaterThan(other: Duration.Duration) {
  return function (self: Duration.Duration) {
    return self._milliseconds > other._milliseconds;
  }
}

function isEqual(other: Duration.Duration) {
  return function (self: Duration.Duration) {
    return self._milliseconds === other._milliseconds;
  }
}

function isLesserThanOrEqual(other: Duration.Duration) {
  return function (self: Duration.Duration) {
    return self._milliseconds <= other._milliseconds;
  }
}

function isGreaterThanOrEqual(other: Duration.Duration) {
  return function (self: Duration.Duration) {
    return self._milliseconds >= other._milliseconds;
  }
}

export const Duration = {
  /**
   * Constructors
   */
  from,

  /**
   * Operations
   */
  abs,
  add,
  difference,
  divide,
  inverse,
  multiply,
  subtract,

  /**
   * Methods
   */
  isEqual,
  isGreaterThan,
  isGreaterThanOrEqual,
  isLesserThan,
  isLesserThanOrEqual,
  toString,

  /**
   * Constants
   */
  MILLISECONDS_PER_DAY: 1000 * 60 * 60 * 24,
  MILLISECONDS_PER_HOUR: 1000 * 60 * 60,
  MILLISECONDS_PER_MINUTE: 1000 * 60,
  MILLISECONDS_PER_SECOND: 1000,
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  MINUTES_PER_DAY: 24 * 60,
  SECONDS_PER_MINUTE: 60,
  SECONDS_PER_HOUR: 24 * 60,
  SECONDS_PER_DAY: 24 * 60 * 60,
}
