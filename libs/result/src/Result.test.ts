import { describe, expect, it, vi } from "vitest"
import { Result } from "./Result"
import { Option } from "@neono/option";

describe("Result", () => {
  it("should return a `Ok`", () => {
    const result = Result.Ok(5);

    expect(result).toStrictEqual({
      _tag: "Ok",
      value: 5,
    })
  })

  it("should return a `Err`", () => {
    const result = Result.Err("Oh no");

    expect(result).toStrictEqual({
      _tag: "Err",
      error: "Oh no",
    })
  })

  it("should combine correctly without errors", () => {
    const result = Result.combine(Result.Ok(5), Result.Ok("Hello, World!"))

    expect(result).toStrictEqual({
      _tag: "Ok",
      value: [5, "Hello, World!"],
    })
  })

  it("should combine correctly with error", () => {
    const result = Result.combine(Result.Ok(5), Result.Err("Oh no"))

    expect(result).toStrictEqual({
      _tag: "Err",
      error: "Oh no",
    })
  })



  describe("`flatten`", () => {
    it("with wrapper being a `Ok` and contained being a `Ok`, it should return contained success result", () => {
      const result = Result.Ok(Result.Ok(5))
      const final = Result.flatten(result)

      expect(final).toStrictEqual(Result.Ok(5))
    })

    it("with wrapper being a `Ok` and contained being a `Err`, it should return contained failure result", () => {
      const result = Result.Ok(Result.Err("Oh no"))
      const final = Result.flatten(result)

      expect(final).toStrictEqual(Result.Err("Oh no"))
    })

    it("with wrapper being a `Err` and contained being a `Ok`, it should return wrapped failure result", () => {
      const x: Result.Result<Result.Result<string, number>, number> = Result.Err(6);

      expect(x).toStrictEqual(Result.Err(6))
    })
  })

  describe("with a `Ok`", () => {
    const result: Result.Result<number, string> = Result.Ok(5);

    it("`isOk` should return true", () => {
      expect(Result.isOk(result)).toBe(true)
    })

    it("`isOkAnd` should return true if predicate is correct", () => {
      expect(Result.isOkAnd((x) => x === 5)(result)).toBe(true)
    })

    it("`isOkAnd` should return false if predicate is incorrect", () => {
      expect(Result.isOkAnd((x) => x === 0)(result)).toBe(false)
    })

    it("`isErr` should return false", () => {
      expect(Result.isErr(result)).toBe(false)
    })

    it("`isErrAnd` should return false", () => {
      expect(Result.isErrAnd((x) => x === 5)(result)).toBe(false)
    })

    it("`map` should return correct value", () => {
      const square = Result.map((v: number) => v * v);

      expect(square(result)).toStrictEqual(Result.Ok(25))
    })

    it("`mapErr` should return wrapped value", () => {
      const final = Result.mapErr((v: string) => v.length)(result);

      expect(final).toBe(result)
    })

    it("`mapOr` should return correct value", () => {
      const squareOrZero = Result.mapOr(0, (v: number) => v * v);

      expect(squareOrZero(result)).toStrictEqual(Result.Ok(25))
    })

    it("`mapOrElse` should not call function", () => {
      const computeHard = vi.fn().mockResolvedValue(0)
      const squareOrZero = Result.mapOrElse(computeHard, (v: number) => v * v);
      squareOrZero(result)

      expect(computeHard).not.toHaveBeenCalled();
    })

    it("`mapOrElse` should return correct value", () => {
      const computeHard = vi.fn().mockResolvedValue(0)
      const squareOrZero = Result.mapOrElse(computeHard, (v: number) => v * v);
      const final = squareOrZero(result)

      expect(final).toStrictEqual(Result.Ok(25));
    })

    it("`andThen` should return correct value when fn returns a `Ok`", () => {
      function sqThenToString(x: number): Result.Result<string, string> {
        if (x > 100) return Result.Err("overflowed")
        return Result.map<number, string, string>((v: number) => v.toString())(Result.Ok(x * x));
      }

      const andThenSqThenToString = Result.andThen<number, string, string, string>(sqThenToString);
      const final = andThenSqThenToString(result)

      expect(final).toStrictEqual(Result.Ok("25"))
    })

    it("`andThen` should return correct value when fn returns a `Err`", () => {
      function sqThenToString(x: number): Result.Result<string, string> {
        if (x > 100) return Result.Err("overflowed")
        return Result.map<number, string, string>((v: number) => v.toString())(Result.Ok(x * x));
      }

      const andThenSqThenToString = Result.andThen<number, string, string, string>(sqThenToString);
      const final = andThenSqThenToString(Result.Ok(200))

      expect(final).toStrictEqual(Result.Err("overflowed"))
    })

    it("`and` should return second success result", () => {
      const result2 = Result.Ok("Ok!");
      const final = Result.and(result2)(result);

      expect(final).toBe(result2)
    })

    it("`and` should return second failure result", () => {
      const result2 = Result.Err("Oh no");
      const final = Result.and(result2)(result);

      expect(final).toBe(result2)
    })

    it("`ok` should return a `Some`", () => {
      const final = Result.ok(result)

      expect(final).toStrictEqual(Option.Some(5))
    })

    it("`err` should convert to an `Option.None`", () => {
      const final = Result.err(result);

      expect(final).toStrictEqual(Option.None);
    })

    it("`inspect` should execute callback function", () => {
      const inspectFn = vi.fn();
      Result.inspect(inspectFn)(result)

      expect(inspectFn).toHaveBeenNthCalledWith(1, 5)
    })

    it("`inspect` should return previous value without changing it", () => {
      const final = Result.inspect((v: number) => v * 5)(result)

      expect(final).toBe(result)
    })

    it("`inspectErr` should not execute callback function", () => {
      const inspectErrFn = vi.fn();
      Result.inspectErr(inspectErrFn)(result)

      expect(inspectErrFn).not.toHaveBeenCalled()
    })

    it("`inspectErr` should return previous value without changing it", () => {
      const final = Result.inspectErr((v: string) => v.length)(result)

      expect(final).toBe(result)
    })

    it("`intoOk` should return wrapped value", () => {
      const final = Result.intoOk(result);

      expect(final).toBe(5)
    })

    it("`intoErr` should return type `unknown`", () => {
      const final = Result.intoErr(result);

      // @ts-expect-error Please remove this line to see the error.
      parseInt(final);
    })

    it("`intoErr` should return `undefined`", () => {
      const final = Result.intoErr(result);

      expect(final).toBeUndefined();
    })

    it("`intoErr` should return type `unknown`", () => {
      const final = Result.intoErr(result);

      // @ts-expect-error Please remove this line to see the error.
      parseInt(final);
    })

    it("`expect` should return wrapped value", () => {
      const final = Result.expect("Testing expect")(result);

      expect(final).toBe(5)
    })

    it("`expectErr` should throw", () => {
      expect(() => {
        Result.expectErr("Testing expectErr")(result)
      }).toThrow("Testing expectErr: 5")
    })

    it("`or` should return success result", () => {
      const other: Result.Result<number, string> = Result.Err("late error")
      const final = Result.or(other)(result)

      expect(final).toBe(result)
    })

    it("`orElse` should return success result", () => {
      const sq = (x: number): Result.Result<number, number> => Result.Ok(x * x)

      const result: Result.Result<number, number> = Result.Ok(5);

      const final = Result.orElse(sq)(result)

      expect(final).toBe(result)
    })

    it("`transpose` should transport to a `Some`", () => {
      const result = Result.Ok(Option.Some(5));
      const final = Result.transpose(result);

      expect(final).toStrictEqual(Option.Some(Result.Ok(5)))
    })

    it("`transpose` should transport to a `None`", () => {
      const result = Result.Ok(Option.None);
      const final = Result.transpose(result);

      expect(final).toStrictEqual(Option.None)
    })

    it("`unwrap` should return contained value", () => {
      expect(Result.unwrap(result)).toBe(5)
    })

    it("`unwrapOr` should return contained value", () => {
      const final = Result.unwrapOr(0)(result);

      expect(final).toBe(5)
    })

    it("`unwrapOrElse` should return callback value", () => {
      const defaultFn = () => 0
      const final = Result.unwrapOrElse(defaultFn)(result);

      expect(final).toBe(5)
    })

    it("`unwrapErr` should throw with contained value", () => {
      expect(() => {
        Result.unwrapErr(result)
      }).toThrow("5")
    })
  })

  describe("with a `Err`", () => {
    const result: Result.Result<number, string> = Result.Err("Oh no");

    it("`isOk` should return false", () => {
      expect(Result.isOk(result)).toBe(false)
    })

    it("`isOkAnd` should return false", () => {
      expect(Result.isOkAnd((x) => x === "Oh no")(result)).toBe(false)
    })

    it("`isErr` should return true", () => {
      expect(Result.isErr(result)).toBe(true)
    })

    it("`isErrAnd` should return true if predicate is correct", () => {
      expect(Result.isErrAnd((x) => x === "Oh no")(result)).toBe(true)
    })

    it("`isErrAnd` should return false if predicate is incorrect", () => {
      expect(Result.isErrAnd((x) => x === "incorrect")(result)).toBe(false)
    })

    it("`map` should return correct value", () => {
      const square = Result.map((v: number) => v * v);

      expect(square(result)).toBe(result)
    })

    it("`mapErr` should return callback value", () => {
      const final = Result.mapErr((v: string) => `Error: ${v}`)(result);

      expect(final).toStrictEqual(Result.Err(`Error: Oh no`))
    })

    it("`mapOr` should return correct value", () => {
      const squareOrZero = Result.mapOr(0, (v: number) => v * v);

      expect(squareOrZero(result)).toStrictEqual(Result.Ok(0))
    })

    it("`mapOrElse` should call function", () => {
      const computeHard = vi.fn().mockReturnValueOnce(0)
      const squareOrZero = Result.mapOrElse(computeHard, (v: number) => v * v);
      squareOrZero(result)

      expect(computeHard).toHaveBeenCalledOnce();
    })

    it("`mapOrElse` should return correct value", () => {
      const computeHard = vi.fn().mockReturnValueOnce(0)
      const squareOrZero = Result.mapOrElse(computeHard, (v: number) => v * v);
      const final = squareOrZero(result)

      expect(final).toStrictEqual(Result.Ok(0));
    })

    it("`andThen` should return correct value when fn returns a `Ok`", () => {
      function sqThenToString(x: number): Result.Result<string, string> {
        if (x > 100) return Result.Err("overflowed")
        return Result.map<number, string, string>((v: number) => v.toString())(Result.Ok(x * x));
      }

      const andThenSqThenToString = Result.andThen<number, string, string, string>(sqThenToString);
      const final = andThenSqThenToString(result)

      expect(final).toBe(result)
    })

    it("`and` should return first failure result", () => {
      const result2 = Result.Ok("Ok!");
      const final = Result.and(result2)(result);

      expect(final).toBe(result)
    })

    it("`and` should return first failure result", () => {
      const result2 = Result.Err("Oh no");
      const final = Result.and(result2)(result);

      expect(final).toBe(result)
    })

    it("`ok` should return a `None`", () => {
      const final = Result.ok(result)

      expect(final).toBe(Option.None)
    })

    it("`err` should convert to an `Option.Some`", () => {
      const final = Result.err(result);

      expect(final).toStrictEqual(Option.Some("Oh no"));
    })

    it("`inspect` should not execute callback function", () => {
      const inspectFn = vi.fn();
      Result.inspect(inspectFn)(result)

      expect(inspectFn).not.toHaveBeenCalled();
    })

    it("`inspect` should return previous value without changing it", () => {
      const final = Result.inspect((v: number) => v * 5)(result)

      expect(final).toBe(result)
    })

    it("`inspectErr` should execute callback function", () => {
      const inspectErrFn = vi.fn();
      Result.inspectErr(inspectErrFn)(result)

      expect(inspectErrFn).toHaveBeenNthCalledWith(1, "Oh no")
    })

    it("`inspectErr` should return previous value without changing it", () => {
      const final = Result.inspectErr((v: string) => v.length)(result)

      expect(final).toBe(result)
    })

    it("`intoOk` should return `undefined`", () => {
      const final = Result.intoOk(result);

      expect(final).toBeUndefined();
    })

    it("`intoOk` should return type `unknown`", () => {
      // We cannot test TypeScript type in a unit test, but we can see the type error
      const final = Result.intoOk(result);

      // @ts-expect-error Please remove this line to see the error.
      parseInt(final);
    })

    it("`intoErr`should return wrapped error", () => {
      const x = Result.Err("Oh no");
      const final = Result.intoErr(x);

      expect(final).toBe("Oh no")
    })

    it("`expect` should throw", () => {
      expect(() => {
        Result.expect("Testing expect")(result)
      }).toThrow('Testing expect: "Oh no"')
    })

    it("`expectErr` should return wrapped error", () => {
      const final = Result.expectErr("Testing expectErr")(result);

      expect(final).toBe("Oh no")
    })

    it("`or` should return success result", () => {
      const other: Result.Result<number, string> = Result.Ok(5);
      const final = Result.or(other)(result)

      expect(final).toBe(other)
    })

    it("`orElse` should return success result", () => {
      const sq = (x: number): Result.Result<number, never> => Result.Ok(x * x)

      const result: Result.Result<number, number> = Result.Err(3)

      const final = Result.orElse(sq)(result)

      expect(final).toStrictEqual(Result.Ok(9))
    })

    it("`transpose` should transport to a `Some`", () => {
      const result = Result.Err("Oh no");
      const final = Result.transpose(result);

      expect(final).toStrictEqual(Option.Some(result))
    })

    it("`unwrap` should throw with contained error", () => {
      expect(() => {
        Result.unwrap(result)
      }).toThrow("Oh no")
    })

    it("`unwrapOr` should return default value", () => {
      const final = Result.unwrapOr(0)(result);

      expect(final).toBe(0)
    })

    it("`unwrapOrElse` should return callback value", () => {
      const defaultFn = () => 0
      const final = Result.unwrapOrElse(defaultFn)(result);

      expect(final).toBe(0)
    })

    it("`unwrapErr` should return contained value", () => {
      expect(Result.unwrapErr(result)).toBe("Oh no")
    })
  })
})
