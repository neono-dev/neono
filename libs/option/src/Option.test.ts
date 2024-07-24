import { Result } from "@neono/result/dist/src/Result";
import { describe, expect, it, vi } from "vitest";
import { Option } from "./Option";

describe("Option", () => {
  it("should create a `Some` option", () => {
    const option = Option.Some(5);

    expect(option).toStrictEqual({
      __tag: "Some",
      value: 5,
    });
  });

  it("should create a `None` option", () => {
    const option = Option.None;

    expect(option).toStrictEqual({
      __tag: "None",
    });
  });

  it("should create a `Some` option from nullable", () => {
    const option = Option.fromNullable(5);

    expect(option).toStrictEqual({
      __tag: "Some",
      value: 5,
    });
  });

  it("should create a `None` option from nullable", () => {
    const option = Option.fromNullable(null);

    expect(option).toStrictEqual({
      __tag: "None",
    });
  });

  describe("with a `Some` option", () => {
    const option = Option.Some(5);

    it("`isSome` should return true", () => {
      expect(Option.isSome(option)).toBe(true);
    });

    it("`isNone` should return false", () => {
      expect(Option.isNone(option)).toBe(false);
    });

    it("`map` should return correct value", () => {
      const square = Option.map((v: number) => v * v);

      expect(square(option)).toStrictEqual(Option.Some(25));
    });

    it("`mapOr` should return correct value", () => {
      const square = Option.mapOr(0, (v: number) => v * v);

      expect(square(option)).toStrictEqual(Option.Some(25));
    });

    it("`mapOrElse` should return correct value", () => {
      const fn = () => 0;
      const square = Option.mapOrElse(fn, (v: number) => v * v);

      expect(square(option)).toStrictEqual(Option.Some(25));
    });

    it("`match` should return correct value", () => {
      const squareOrZero = Option.match({
        Some: (v: number) => v * v,
        None: 0,
      });

      expect(squareOrZero(option)).toStrictEqual(Option.Some(25));
    });

    it("`unwrap` should return contained value", () => {
      const result = Option.unwrap(option);

      expect(result).toBe(5);
    });

    it("`unwrapOr` should return contained value", () => {
      const valueOrZero = Option.unwrapOr(0);
      const result = valueOrZero(option);

      expect(result).toBe(5);
    });

    it("`unwrapOrElse` should return contained value", () => {
      const valueOrZero = Option.unwrapOrElse(() => 0);
      const result = valueOrZero(option);

      expect(result).toBe(5);
    });

    it("`and` should return second option", () => {
      const secondOption = Option.Some("Hello");
      const result = Option.and(secondOption)(option);

      expect(result).toBe(secondOption);
    });

    it("`andThen` should return second callback option", () => {
      const secondOption = Option.Some("Hello");
      const callback = () => secondOption;
      const result = Option.andThen(callback)(option);

      expect(result).toBe(secondOption);
    });

    it("`expect` should return contained value", () => {
      const result = Option.expect("oh no!")(option);

      expect(result).toBe(5);
    });

    it("`filter` should return `Some` when predicate is valid", () => {
      const isEven = (n: number) => n % 2 === 0;
      const option = Option.Some(4);
      const result = Option.filter(isEven)(option);

      expect(result).toBe(option);
    });

    it("`filter` should return `None` when predicate is invalid", () => {
      const isEven = (n: number) => n % 2 === 0;
      const option = Option.Some(5);
      const result = Option.filter(isEven)(option);

      expect(result).toBe(Option.None);
    });

    it("`flatten` should convert to a single option", () => {
      const option = Option.Some(Option.Some(5));
      const result = Option.flatten(option);

      expect(result).toStrictEqual(Option.Some(5));
    });

    it("`inspect` should return original option", () => {
      const fn = vi.fn();
      const result = Option.inspect(fn)(option);

      expect(result).toBe(option);
    });

    it("`inspect` should execute callback", () => {
      const fn = vi.fn();
      Option.inspect(fn)(option);

      expect(fn).toHaveBeenNthCalledWith(1, 5);
    });

    it("`okOr` should return a `Result`", () => {
      const result = Option.okOr(0)(option);

      expect(result).toStrictEqual(Result.Ok(5));
    });

    it("`okOrElse` should return a `Result`", () => {
      const result = Option.okOrElse(() => 0)(option);

      expect(result).toStrictEqual(Result.Ok(5));
    });

    it("`or` should return first value", () => {
      const defaultOption = Option.Some(100);
      const result = Option.or(defaultOption)(option);

      expect(result).toBe(option);
    });

    it("`orElse` should return first value", () => {
      const defaultFn = () => Option.Some(100);
      const result = Option.orElse(defaultFn)(option);

      expect(result).toBe(option);
    });

    it("`transpose` should return a Result.Ok", () => {
      const option: Option.Option<Result.Result<number, string>> = Option.Some(
        Result.Ok(5)
      );
      const result = Option.transpose(option);

      expect(result).toStrictEqual(Result.Ok(Option.Some(5)));
    });

    it("`transpose` should return a Result.Err", () => {
      const option: Option.Option<Result.Result<number, string>> = Option.Some(
        Result.Err("Oh no")
      );
      const result = Option.transpose(option);

      expect(result).toStrictEqual(Result.Err("Oh no"));
    });

    it("`unzip` should return correct value", () => {
      const result = Option.unzip(Option.Some([1, "hi"]));

      expect(result).toStrictEqual([Option.Some(1), Option.Some("hi")]);
    });

    it("`zip` should return a zipped value", () => {
      const optionA = Option.Some(1);
      const optionB = Option.Some("hi");

      const result = Option.zip(optionB)(optionA);

      expect(result).toStrictEqual(Option.Some([1, "hi"]));
    });

    it("`zip` should return a None", () => {
      const optionA = Option.Some(1);
      const optionB: Option.Option<string> = Option.None;

      const result = Option.zip(optionB)(optionA);

      expect(result).toStrictEqual(Option.None);
    });

    it("`zipWith` should return a zipped value", () => {
      const optionA = Option.Some(1);
      const optionB = Option.Some("hi");
      const fn = (a: number, b: string) => a + b.length;

      const result = Option.zipWith(optionB, fn)(optionA);

      expect(result).toStrictEqual(Option.Some(3));
    });

    it("`zipWith` should return a None", () => {
      const optionA = Option.Some(1);
      const optionB: Option.Option<string> = Option.None;
      const fn = (a: number, b: string) => a + b.length;

      const result = Option.zipWith(optionB, fn)(optionA);

      expect(result).toStrictEqual(Option.None);
    });
  });

  describe("with a `None` option", () => {
    const option: Option.Option<number> = Option.None;

    it("`isSome` should return true", () => {
      expect(Option.isSome(option)).toBe(false);
    });

    it("`isNone` should return true", () => {
      expect(Option.isNone(option)).toBe(true);
    });

    it("`map` should return a `None`", () => {
      const square = Option.map((v: number) => v * v);

      expect(square(option)).toStrictEqual(Option.None);
    });

    it("`mapOr` should return correct value", () => {
      const square = Option.mapOr(0, (v: number) => v * v);

      expect(square(option)).toStrictEqual(Option.Some(0));
    });

    it("`mapOrElse` should return correct value", () => {
      const fn = () => 0;
      const square = Option.mapOrElse(fn, (v: number) => v * v);

      expect(square(option)).toStrictEqual(Option.Some(0));
    });

    it("`match` should return correct value", () => {
      const squareOrZero = Option.match({
        Some: (v: number) => v * v,
        None: 0,
      });

      expect(squareOrZero(option)).toStrictEqual(Option.Some(0));
    });

    it("`unwrap` should throw an error", () => {
      expect(() => {
        Option.unwrap(option);
      }).toThrow("[Option] Tried to unwrap an `Option.None`.");
    });

    it("`unwrapOr` should return default value", () => {
      const valueOrZero = Option.unwrapOr(0);
      const result = valueOrZero(option);

      expect(result).toBe(0);
    });

    it("`unwrapOrElse` should return callback value", () => {
      const valueOrZero = Option.unwrapOrElse(() => 0);
      const result = valueOrZero(option);

      expect(result).toBe(0);
    });

    it("`and` should return first option", () => {
      const secondOption = Option.Some("Hello");
      const result = Option.and(secondOption)(option);

      expect(result).toBe(option);
    });

    it("`andThen` should return first option", () => {
      const secondOption = Option.Some("Hello");
      const callback = () => secondOption;
      const result = Option.andThen(callback)(option);

      expect(result).toBe(option);
    });

    it("`expect` should throw with given message", () => {
      expect(() => {
        Option.expect("oh no!")(option);
      }).toThrow("oh no!");
    });

    it("`filter` should return `None`", () => {
      const isEven = (n: number) => n % 2 === 0;
      const result = Option.filter(isEven)(option);

      expect(result).toBe(Option.None);
    });

    it("`flatten` should return none", () => {
      const option = Option.Some(Option.None);
      const result = Option.flatten(option);

      expect(result).toBe(Option.None);
    });

    it("`inspect` should return original option", () => {
      const fn = vi.fn();
      const result = Option.inspect(fn)(option);

      expect(result).toBe(option);
    });

    it("`inspect` should not execute callback", () => {
      const fn = vi.fn();
      Option.inspect(fn)(option);

      expect(fn).not.toHaveBeenCalled();
    });

    it("`okOr` should return a `Result`", () => {
      const result = Option.okOr(0)(option);

      expect(result).toStrictEqual(Result.Err(0));
    });

    it("`okOrElse` should return a `Result`", () => {
      const result = Option.okOrElse(() => 0)(option);

      expect(result).toStrictEqual(Result.Err(0));
    });

    it("`or` should return second value", () => {
      const defaultOption = Option.Some(100);
      const result = Option.or(defaultOption)(option);

      expect(result).toBe(defaultOption);
    });

    it("`orElse` should return first value", () => {
      const defaultOption = Option.Some(100);
      const defaultFn = () => defaultOption;
      const result = Option.orElse(defaultFn)(option);

      expect(result).toBe(defaultOption);
    });

    it("`transpose` should return a Result", () => {
      const option: Option.Option<Result.Result<number, string>> = Option.None;
      const result = Option.transpose(option);

      expect(result).toStrictEqual(Result.Ok(Option.None));
    });

    it("`unzip` should return correct value", () => {
      const option = Option.None as Option.Option<[number, string]>;
      const result = Option.unzip(option);

      expect(result).toStrictEqual([Option.None, Option.None]);
    });

    it("`zip` should return a None", () => {
      const optionA: Option.Option<number> = Option.None;
      const optionB = Option.Some("hi");

      const result = Option.zip(optionB)(optionA);

      expect(result).toStrictEqual(Option.None);
    });

    it("`zipWith` should return a None", () => {
      const optionA: Option.Option<number> = Option.None;
      const optionB = Option.Some("hi");
      const fn = (a: number, b: string) => a + b.length;

      const result = Option.zipWith(optionB, fn)(optionA);

      expect(result).toStrictEqual(Option.None);
    });
  });
});
