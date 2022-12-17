import * as Tape from './Tape'
import { TapeGenerator } from './TapeGenerator'

export abstract class Base {
  private _?: any;
  abstract Generate(generator: TapeGenerator) : Tape.Code;
}

export class Primitive extends Base {
  public value: any;

  constructor(value: any) {
    super();
    this.value = value;
  }

  Generate(generator: Tape.Generator): Tape.Code {
    return generator.Literal(this);
  }
}

export class Array extends Base {
  public values: Base[];

  constructor(...values: Base[]) {
    super();
    this.values = values;
  }

  Generate(generator: Tape.Generator): Tape.Code {
    return generator.Array(this);
  }
}