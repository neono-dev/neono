import { Result } from "@neono/result";

export namespace Option {
  export type Some<T> = { __tag: "Some", value: T };
  export type None = { __tag: "None" };
  export type Option<T> = Some<T> | None;
}

function Some<T>(value: T): Option.Option<T> {
  return {
    __tag: "Some",
    value: value,
  }
}

const None: Option.Option<never> = {
  __tag: "None",
}

function isSome<T>(self: Option.Option<T>): self is Option.Some<T> {
  return self.__tag === "Some"
}

function isNone<T>(self: Option.Option<T>): self is Option.None {
  return self.__tag === "None"
}

function fromNullable<T>(value: T | null): Option.Option<T> {
  if (value === null) return None;
  return Some(value);
}

function map<T, U>(fn: (value: T) => U) {
  return function (self: Option.Option<T>): Option.Option<U> {
    if (isNone(self)) return self;
    return Some(fn(self.value));
  }
}

function mapOr<T, U>(defaultValue: U, fn: (value: T) => U) {
  return function (self: Option.Option<T>): Option.Option<U> {
    if (isNone(self)) return Some(defaultValue);
    return Some(fn(self.value));
  }
}

function mapOrElse<T, U>(cb: () => U, fn: (value: T) => U) {
  return function (self: Option.Option<T>): Option.Option<U> {
    if (isNone(self)) return Some(cb());
    return Some(fn(self.value));
  }
}

function match<T, U>(fns: { Some: (v: T) => U, None: U }) {
  return function (self: Option.Option<T>): Option.Option<U> {
    if (isNone(self)) return Some(fns.None);
    return Some(fns.Some(self.value));
  }
}

function unwrap<T>(self: Option.Option<T>): T {
  if (isNone(self)) {
    throw new Error("[Option] Tried to unwrap an `Option.None`.");
  }

  return self.value;
}

function unwrapOr<T>(defaultValue: T) {
  return function (self: Option.Option<T>): T {
    if (isNone(self)) {
      return defaultValue;
    }

    return self.value;
  }
}

function unwrapOrElse<T>(fn: () => T) {
  return function (self: Option.Option<T>): T {
    if (isNone(self)) {
      return fn();
    }

    return self.value;
  }
}

function and<T, U>(secondOption: Option.Option<U>) {
  return function (self: Option.Option<T>): Option.Option<U> {
    if (isNone(self)) return self;
    return secondOption;
  }
}

function andThen<T, U>(callback: (value: T) => Option.Option<U>) {
  return function (self: Option.Option<T>): Option.Option<U> {
    if (isNone(self)) return self;
    return callback(self.value);
  }
}

function expect<T>(message: string) {
  return function (self: Option.Option<T>): T {
    if (isNone(self)) {
      throw new Error(message);
    }

    return self.value;
  }
}

function filter<T>(predicate: (value: T) => boolean) {
  return function (self: Option.Option<T>): Option.Option<T> {
    if (isNone(self)) return self;
    if (predicate(self.value)) return self;
    return None;
  }
}

function flatten<T>(self: Option.Option<Option.Option<T>>): Option.Option<T> {
  if (isNone(self)) return self;
  return self.value;
}

function inspect<T>(fn: (value: T) => unknown) {
  return function (self: Option.Option<T>): Option.Option<T> {
    if (isNone(self)) return self;
    fn(self.value);
    return self;
  }
}

function okOr<T, E>(error: E) {
  return function (self: Option.Option<T>): Result.Result<T, E> {
    if (isNone(self)) return Result.Err(error);
    return Result.Ok(self.value)
  }
}

function okOrElse<T, E>(fn: () => E) {
  return function (self: Option.Option<T>): Result.Result<T, E> {
    if (isNone(self)) return Result.Err(fn());
    return Result.Ok(self.value)
  }
}

function or<T>(defaultOption: Option.Option<T>) {
  return function (self: Option.Option<T>): Option.Option<T> {
    if (isNone(self)) return defaultOption;
    return self;
  }
}

function orElse<T>(fn: () => Option.Option<T>) {
  return function (self: Option.Option<T>): Option.Option<T> {
    if (isNone(self)) return fn();
    return self;
  }
}

function transpose<T, E>(self: Option.Option<Result.Result<T, E>>): Result.Result<Option.Option<T>, E> {
  if (isNone(self)) return Result.Ok(self);
  if (Result.isErr(self.value)) return self.value;
  return Result.Ok(Option.Some(self.value.value))
}

function unzip<T, U>(self: Option.Option<[T, U]>): [Option.Option<T>, Option.Option<U>] {
  if (isNone(self)) return [Option.None, Option.None];
  return [Option.Some(self.value[0]), Option.Some(self.value[1])]
}

function zip<T, U>(other: Option.Option<U>) {
  return function (self: Option.Option<T>): Option.Option<[T, U]> {
    if (isNone(self)) return self;
    if (isNone(other)) return other;

    return Option.Some([self.value, other.value])
  }
}

function zipWith<T, U, V>(other: Option.Option<U>, fn: (a: T, b: U) => V) {
  return function (self: Option.Option<T>): Option.Option<V> {
    if (isNone(self)) return self;
    if (isNone(other)) return other;

    return Option.Some(fn(self.value, other.value))
  }
}

export const Option = {
  None,
  Some,
  and,
  andThen,
  expect,
  filter,
  flatten,
  fromNullable,
  inspect,
  isNone,
  isSome,
  map,
  mapOr,
  mapOrElse,
  match,
  okOr,
  okOrElse,
  or,
  orElse,
  transpose,
  unwrap,
  unwrapOr,
  unwrapOrElse,
  unzip,
  zip,
  zipWith,
}
