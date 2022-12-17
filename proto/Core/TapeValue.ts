import TapeCode = require('./TapeCode');
import { TapeGenerator } from './TapeGenerator'

abstract class TapeValue {
  private _?: any;
  abstract Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeValue {
  export class Symbol extends TapeValue {
    private name: String;
  
    constructor(name: String) {
      super();
      this.name = name;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return new TapeCode(this.name);
    }
  }
  
  export class Literal extends TapeValue {
    public value: any;
  
    constructor(value: any) {
      super();
      this.value = value;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Literal(this);
    }
  }
  
  export class Array extends TapeValue {
    public values: TapeValue[];
  
    constructor(...values: TapeValue[]) {
      super();
      this.values = values;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Array(this);
    }
  }
}

export = TapeValue;