import * as Tape from './Tape'
import TapeDefinition = require('./TapeDefinition');
import TapeExpression = require('./TapeExpression');
import { TapeGenerator } from './TapeGenerator'

abstract class TapeStatement {
  abstract Generate(generator: TapeGenerator) : Tape.Code;
}

namespace TapeStatement {
  export class Block extends TapeStatement {
    public defs: TapeStatement[] | TapeDefinition[];
  
    constructor(defs: TapeStatement[] | TapeDefinition[]) {
      super();
      this.defs = defs;
    }
  
    Generate(generator: Tape.Generator): Tape.Code {
      return generator.Block(this);
    }
  }
  
  export class If extends TapeStatement {
    public condition: TapeExpression;
    public def: TapeDefinition;
    public elseDef?: TapeDefinition = undefined;
  
    constructor(condition: TapeExpression, def: TapeDefinition) {
      super();
  
      this.condition = condition;
      this.def = def;
    }
  
    Else(elseDef: TapeDefinition) : If {
      this.elseDef = elseDef;
      return this;
    }
  
    Generate(generator: Tape.Generator): Tape.Code {
      return generator.If(this);
    }
  }
}

export = TapeStatement;
