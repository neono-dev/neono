import { Option } from "@neono/option";

type ExtractSuccessValues<T extends Array<Result.Result<any, any>>> = {
  [K in keyof T]: T[K] extends Result.Result<infer U, any> ? U : never;
};

type ExtractErrValues<T extends Array<Result.Result<any, any>>> = {
  [K in keyof T]: T[K] extends Result.Result<any, infer E> ? E : never;
}[number];

export namespace Result {
  export type Ok<T> = { _tag: "Ok", value: T }
  export type Err<E> = { _tag: "Err", error: E }
  export type Result<T, E> = Ok<T> | Err<E>
}

function Ok<T>(value: T): Result.Result<T, never> {
  return { _tag: "Ok", value: value }
}

function Err<E>(error: E): Result.Result<never, E> {
  return { _tag: "Err", error: error }
}

function isOk<T, E>(self: Result.Result<T, E>): self is Result.Ok<T> {
  return self._tag === "Ok"
}

function isOkAnd<T, E>(predicate: (value: T) => boolean) {
  return function (self: Result.Result<T, E>): boolean {
    if (isErr(self)) return false;
    return predicate(self.value);
  }
}

function isErr<T, E>(self: Result.Result<T, E>): self is Result.Err<E> {
  return self._tag === "Err"
}

function isErrAnd<T, E>(predicate: (error: E) => boolean) {
  return function (self: Result.Result<T, E>): boolean {
    if (isOk(self)) return false;
    return predicate(self.error);
  }
}

function combine<T extends Array<Result.Result<any, any>>>(
  ...results: T
): Result.Result<ExtractSuccessValues<T>, ExtractErrValues<T>> {
  const values: ExtractSuccessValues<T> = [] as unknown as ExtractSuccessValues<T>;

  for (const result of results) {
    if (isOk(result)) {
      values.push(result.value);
    } else {
      return result;
    }
  }

  return Ok(values);
}

function map<T, E, U>(fn: (value: T) => U) {
  return function (self: Result.Result<T, E>): Result.Result<U, E> {
    if (isErr(self)) return self;
    return Ok(fn(self.value));
  }
}

function mapErr<T, E, F>(fn: (error: E) => F) {
  return function (self: Result.Result<T, E>): Result.Result<T, F> {
    if (isOk(self)) return self;
    return Err(fn(self.error));
  }
}

function mapOr<T, E, U>(defaultValue: U, fn: (value: T) => U) {
  return function (self: Result.Result<T, E>): Result.Result<U, E> {
    if (isErr(self)) return Ok(defaultValue);
    return Ok(fn(self.value));
  }
}

function mapOrElse<T, E, U>(fnWhenFailure: (error: E) => U, fnWhenSuccess: (value: T) => U) {
  return function (self: Result.Result<T, E>): Result.Result<U, E> {
    if (isErr(self)) return Ok(fnWhenFailure(self.error));
    return Ok(fnWhenSuccess(self.value));
  }
}

function andThen<T, E, U, F>(fn: (value: T) => Result.Result<U, F>) {
  return function (self: Result.Result<T, E>): Result.Result<U, E | F> {
    if (isErr(self)) return self;
    return fn(self.value);
  }
}

function and<T, E, U, F>(result: Result.Result<U, F>) {
  return function(self: Result.Result<T, E>): Result.Result<U, E | F> {
    if (isErr(self)) return self;
    return result;
  }
}

function ok<T, E>(self: Result.Result<T, E>): Option.Option<T> {
  if (isErr(self)) return Option.None;
  return Option.Some(self.value);
}

function inspect<T, E>(fn: (value: T) => unknown) {
  return function (self: Result.Result<T, E>): Result.Result<T, E> {
    if (isErr(self)) return self;
    fn(self.value);
    return self;
  }
}

function inspectErr<T, E, R = unknown>(fn: (error: E) => R) {
  return function (self: Result.Result<T, E>): Result.Result<T, E> {
    if (isOk(self)) return self;
    fn(self.error);
    return self;
  }
}

function flatten<T, E>(self: Result.Result<Result.Result<T, E>, E>): Result.Result<T, E> {
  if (isErr(self)) return self;
  if (isErr(self.value)) return self.value;
  return self.value;
}

function intoOk<T>(self: Result.Result<T, never>): T;
function intoOk<T, E>(self: Result.Result<T, E>): unknown;
function intoOk<T, E>(self: Result.Result<T, E>): unknown {
  if (isOk(self)) return self.value;
  return undefined
}

function intoErr<E>(self: Result.Result<never, E>): E;
function intoErr<T, E>(self: Result.Result<T, E>): unknown;
function intoErr<T, E>(self: Result.Result<T, E>): unknown {
  if (isErr(self)) return self.error;
  return undefined
}

function expect<T, E>(message: string) {
  return function (self: Result.Result<T, E>): T {
    if (isErr(self)) {
      throw new Error(`${message}: ${JSON.stringify(self.error)}`);
    }

    return self.value;
  }
}

function expectErr<T, E>(message: string) {
  return function (self: Result.Result<T, E>): E {
    if (isOk(self)) {
      throw new Error(`${message}: ${JSON.stringify(self.value)}`);
    }

    return self.error;
  }
}

function err<T, E>(self: Result.Result<T, E>): Option.Option<E> {
  if (isOk(self)) return Option.None;
  return Option.Some(self.error)
}

function or<T, E>(other: Result.Result<T, E>) {
  return function (self: Result.Result<T, E>): Result.Result<T, E> {
    if (isErr(self)) return other;
    return self;
  }
}

function orElse<T, E, F>(fn: (error: E) => Result.Result<T, F>) {
  return function (self: Result.Result<T, E>): Result.Result<T, F> {
    if (isOk(self)) return self;
    return fn(self.error)
  }
}

function transpose<T, E>(self: Result.Result<Option.Option<T>, E>): Option.Option<Result.Result<T, E>> {
  if (isOk(self)) {
    if (Option.isNone(self.value)) return self.value;
    return Option.Some(Result.Ok(self.value.value));
  }

  return Option.Some(self)
}

function unwrap<T, E>(self: Result.Result<T, E>): T {
  if (isOk(self)) return self.value;

  throw new Error(JSON.stringify(self.error))
}

function unwrapErr<T, E>(self: Result.Result<T, E>): E {
  if (isErr(self)) return self.error;

  throw new Error(JSON.stringify(self.value))
}

function unwrapOr<T, E>(defaultValue: T) {
  return function (self: Result.Result<T, E>): T {
    if (isErr(self)) return defaultValue;
    return self.value
  }
}

function unwrapOrElse<T, E>(callback: (error: E) => T) {
  return function (self: Result.Result<T, E>): T {
    if (isErr(self)) return callback(self.error);
    return self.value
  }
}

export const Result = {
  Err,
  Ok,
  and,
  andThen,
  combine,
  err,
  expect,
  expectErr,
  flatten,
  inspect,
  inspectErr,
  intoErr,
  intoOk,
  isErr,
  isErrAnd,
  isOk,
  isOkAnd,
  map,
  mapErr,
  mapOr,
  mapOrElse,
  ok,
  or,
  orElse,
  transpose,
  unwrap,
  unwrapErr,
  unwrapOr,
  unwrapOrElse,
}
