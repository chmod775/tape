import { TapeErrorReporter } from "./Interfaces/TapeErrorReporter";

class TapeErrors {
  private readonly _reporter: TapeErrorReporter;

  private readonly _errors: (Boolean | String | TapeErrors)[];
  public get errors(): ReadonlyArray<Boolean | String | TapeErrors> {
    return this._errors;
  }

  public get HasErrors(): Boolean {
    return this._errors.filter(t => (t instanceof TapeErrors) ? t.HasErrors : !t).length > 0;
  }

  constructor(reporter: TapeErrorReporter, errors?: (Boolean | String)[]) {
    this._reporter = reporter;
    this._errors = errors ?? [];
  }

  public static Empty(reporter: TapeErrorReporter): TapeErrors {
    return new TapeErrors(reporter);
  }

  public Map(error: Boolean | String | TapeErrors): Boolean {
    this._errors.push(error);
    return this.HasErrors;
  }

  public Print(indent: number = 0): String[] {
    let ret: String[] = [];
    for (let item of this._errors) {
      if (item instanceof TapeErrors) {
        ret.push(...item.Print(indent + 1));
      } else {
        ret.push(item.toString());
      }
    }
    return ret;
  }
}

export { TapeErrors as TapeErrors };