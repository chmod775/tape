import * as Tape from './Tape'
import { TapeGenerator } from './TapeGenerator';
import TapeValue = require('./TapeValue');

abstract class TapeDefinition {
  abstract Generate(generator: TapeGenerator) : Tape.Code;
}

namespace TapeDefinition {
  export class Variable extends TapeDefinition {
    public name: String;
    public type: Tape.DataTypes;
    public init?: TapeValue;
  
    constructor(name: String, type: Tape.DataTypes) {
      super();
  
      this.name = name;
      this.type = type;
    }
  
    Initialize(value: TapeValue) : Variable {
      this.init = value;
      return this;
    }
  
    Generate(generator: Tape.Generator): Tape.Code {
      return generator.Variable(this);
    }
  }
}

export = TapeDefinition;