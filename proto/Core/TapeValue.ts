import * as Tape from './Tape'
import { TapeGenerator } from './TapeGenerator'

abstract class TapeValue {
  private _?: any;
  abstract Generate(generator: TapeGenerator) : Tape.Code;
}

namespace TapeValue {
  export class Symbol extends TapeValue {
    private name: String;
  
    constructor(name: String) {
      super();
      this.name = name;
    }
  
    Generate(generator: Tape.Generator): Tape.Code {
      return new Tape.Code(this.name);
    }
  }
  
  export class Literal extends TapeValue {
    public value: any;
  
    constructor(value: any) {
      super();
      this.value = value;
    }
  
    Generate(generator: Tape.Generator): Tape.Code {
      return generator.Literal(this);
    }
  }
  
  export class Array extends TapeValue {
    public values: TapeValue[];
  
    constructor(...values: TapeValue[]) {
      super();
      this.values = values;
    }
  
    Generate(generator: Tape.Generator): Tape.Code {
      return generator.Array(this);
    }
  }
}

export = TapeValue;