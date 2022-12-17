import TapeCode = require('./TapeCode');
import TapeDefinition = require('./TapeDefinition');
import TapeExpression = require('./TapeExpression');
import { TapeGenerator } from './TapeGenerator'

abstract class TapeStatement {
  abstract Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeStatement {
  export class Block extends TapeStatement {
    public items: TapeStatement[] | TapeDefinition[];
  
    constructor(items: TapeStatement[] | TapeDefinition[]) {
      super();
      this.items = items;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Block(this);
    }
  }
  
  export class If extends TapeStatement {
    public condition: TapeExpression;
    public ifTrue: TapeStatement | TapeExpression;
    public ifFalse?: TapeStatement | TapeExpression = undefined;
  
    constructor(condition: TapeExpression, ifTrue: TapeStatement | TapeExpression) {
      super();
  
      this.condition = condition;
      this.ifTrue = ifTrue;
    }
  
    Else(ifFalse: TapeStatement | TapeExpression) : If {
      if (this.ifFalse != undefined) throw 'Else already defined for If';
      this.ifFalse = ifFalse;
      return this;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.If(this);
    }
  }
}

export = TapeStatement;
