import { TapeValue } from './TapeValue';
import { TapeExpression } from './TapeExpression';
import { TapeCode } from './TapeCode';
import { TapeType } from './TapeType';
import { TapeDefinition } from './TapeDefinition';
import { TapeGenerator } from './TapeGenerator';
import { TapeScope } from './TapeScope';

abstract class TapeStatement {
  abstract Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeStatement {
  export class Block extends TapeStatement {
    public scope: TapeScope;
    public items: TapeStatement[] | TapeDefinition[];
  
    constructor(items: TapeStatement[] | TapeDefinition[]) {
      super();
      let defs = items.filter(t => t instanceof TapeDefinition) as TapeDefinition[];
      this.scope = new TapeScope(defs);
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
      this.ifTrue = (ifTrue instanceof TapeStatement.Block) ? ifTrue : new TapeStatement.Block([ifTrue]);
    }
  
    Else(ifFalse: TapeStatement | TapeExpression) : If {
      if (this.ifFalse != undefined) throw 'Else already defined for If';
      this.ifFalse = (ifFalse instanceof TapeStatement.Block) ? ifFalse : new TapeStatement.Block([ifFalse]);
      return this;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.If(this);
    }
  }

  export class Return extends TapeStatement {
    public expression: TapeExpression;

    constructor(expression: TapeExpression) {
      super();
      this.expression = expression;
    }

    Generate(generator: TapeGenerator): TapeCode {
      return generator.Return(this);
    }
  }
}

export { TapeStatement as TapeStatement };
