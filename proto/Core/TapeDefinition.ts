import { TapeGenerator } from './TapeGenerator';
import TapeType = require('./TapeType');
import TapeValue = require('./TapeValue');
import TapeCode = require('./TapeCode');

abstract class TapeDefinition {
  abstract Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeDefinition {
  export class Variable extends TapeDefinition {
    public name: String;
    public type: TapeType;
    public init?: TapeValue;
  
    constructor(name: String, type: TapeType) {
      super();
  
      this.name = name;
      this.type = type;
    }
  
    Initialize(value: TapeValue) : Variable {
      this.init = value;
      return this;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Variable(this);
    }
  }
}

export = TapeDefinition;