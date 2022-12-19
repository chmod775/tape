import TapeCode = require('./TapeCode');
import { TapeGenerator } from './TapeGenerator'
import TapeType = require('./TapeType');

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
    public baseType?: TapeType;
    public value: any;
  
    constructor(baseType: TapeType, value: any) {
      super();
      this.baseType = baseType;
      this.value = value;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Literal(this);
    }
  }
  
  export class Array extends TapeValue {
    public baseType?: TapeType;
    public values: TapeValue[];
  
    constructor(baseType: TapeType, ...values: TapeValue[]) {
      super();
      this.baseType = baseType;
      this.values = values;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Array(this);
    }
  }
}

export = TapeValue;