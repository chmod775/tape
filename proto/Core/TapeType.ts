import * as Tape from './Tape'
import { TapeGenerator } from './TapeGenerator'

abstract class TapeType {
  private _?: any;
  abstract Generate(generator: TapeGenerator) : Tape.Code;
}

namespace TapeType {
  export class Primitive extends TapeType {
    public value: any;
  
    constructor(value: any) {
      super();
      this.value = value;
    }
  
    Generate(generator: Tape.Generator): Tape.Code {
      return generator.Literal(this);
    }
  }
  
  export class Array extends TapeType {
    public values: TapeType[];
  
    constructor(...values: TapeType[]) {
      super();
      this.values = values;
    }
  
    Generate(generator: Tape.Generator): Tape.Code {
      return generator.Array(this);
    }
  }
}

export = TapeType;