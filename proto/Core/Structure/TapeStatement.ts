import { TapeValue } from './TapeValue';
import { TapeExpression } from './TapeExpression';
import { TapeCode } from '../TapeCode';
import { TapeType } from './TapeType';
import { TapeDefinition } from './TapeDefinition';
import { TapeGenerator } from '../TapeGenerator';
import { TapeScope } from '../TapeScope';
import { TapeStructure } from '../TapeStructure';

abstract class TapeStatement extends TapeStructure {
}

namespace TapeStatement {
  export class Block extends TapeStatement {
    public items: (TapeExpression | TapeStatement | TapeDefinition)[];
  
    constructor(items: (TapeExpression | TapeStatement | TapeDefinition)[]) {
      super();
      this.items = items;
    }
  

    $Create(parentScope: TapeScope): (Boolean | String)[] {
      this.scope = new TapeScope(this, parentScope);
      return [];
    }

    $Generate(generator: TapeGenerator): TapeCode {
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

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.If(this);
    }
  }

  export class For extends TapeStatement {
    public init: TapeDefinition.Variable | TapeExpression;
    public condition: TapeExpression;
    public increment: TapeExpression;
    public loop: TapeStatement | TapeExpression;

    constructor(init: TapeDefinition.Variable | TapeExpression, condition: TapeExpression, increment: TapeExpression) {
      super();
  
      this.init = init;
      this.condition = condition;
      this.increment = increment;
    }
  
    Loop(loop: TapeStatement | TapeExpression) : For {
      if (this.loop != undefined) throw 'Loop already defined for For';
      this.loop = (loop instanceof TapeStatement.Block) ? loop : new TapeStatement.Block([loop]);
      return this;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.For(this);
    }
  }
  export namespace For {
    export class Break extends TapeStatement {
      $Generate(generator: TapeGenerator): TapeCode {
        return generator.For_Break(this);
      }
    }
  }

  export class Return extends TapeStatement {
    public expression: TapeExpression;

    constructor(expression: TapeExpression) {
      super();
      this.expression = expression;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Return(this);
    }
  }
}

export { TapeStatement as TapeStatement };
