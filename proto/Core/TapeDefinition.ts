import * as Tape from './Tape'
import { TapeGenerator } from './TapeGenerator';
import * as TapeValue from './TapeValue'

export abstract class Base {
  abstract Generate(generator: TapeGenerator) : Tape.Code;
}

export class Variable extends Base {
  public name: String;
  public type: Tape.DataTypes;
  public init?: TapeValue.Base;

  constructor(name: String, type: Tape.DataTypes) {
    super();

    this.name = name;
    this.type = type;
  }

  Initialize(value: TapeValue.Base) : Variable {
    this.init = value;
    return this;
  }

  Generate(generator: Tape.Generator): Tape.Code {
    return generator.Variable(this);
  }
}


