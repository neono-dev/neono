interface DateTimeInvalidateDateStringErrorProps {
  input: string;
}

export class DateTimeInvalidateDateStringError extends Error {
  readonly _tag = "DateTimeInvalidateDateStringError"
  readonly input: string;

  constructor({ input }: DateTimeInvalidateDateStringErrorProps) {
    super();

    this.input = input;
  }
}