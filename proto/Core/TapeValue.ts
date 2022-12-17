import * as Tape from './Tape'

export abstract class Base extends Tape.Base {
  private _?: any;
}

export class Symbol extends Base {
  private name: String;
  constructor(name: String) {
    super();
    this.name = name;
  }

  Generate(generator: Tape.Generator): Tape.Code {
    return new Tape.Code(this.name);
  }
}

export class Literal extends Base {
  private value: any;

  constructor(value: any) {
    super();
    this.value = value;
  }

  Generate(generator: Tape.Generator): Tape.Code {
    let isString = this.value instanceof String;
    if (isString)
      return new Tape.Code(`"${this.value}"`);
    else
      return new Tape.Code(this.value);
  }
}