import { TapeExpression } from './TapeExpression';
import { TapeCode } from '../TapeCode';
import { TapeDefinition } from './TapeDefinition';
import { TapeGenerator } from '../TapeGenerator';
import { TapeScope } from '../TapeScope';
import { TapeStructure } from '../TapeStructure';

abstract class TapeStatement extends TapeStructure {
}

namespace TapeStatement {
  export class Block extends TapeStatement {
    private _items: (TapeExpression | TapeStatement | TapeDefinition)[];
    public get items(): ReadonlyArray<(TapeExpression | TapeStatement | TapeDefinition)> {
      return this._items;
    }

    constructor(items: (TapeExpression | TapeStatement | TapeDefinition)[]) {
      super();
      this._items = items;
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
    private _condition: TapeExpression;
    public get condition(): TapeExpression {
      return this._condition;
    }

    private _ifTrue: TapeStatement | TapeExpression;
    public get ifTrue(): TapeStatement | TapeExpression {
      return this._ifTrue;
    }

    private _ifFalse?: TapeStatement | TapeExpression = undefined;
    public get ifFalse(): (TapeStatement | TapeExpression) | undefined {
      return this._ifFalse;
    }

    constructor(condition: TapeExpression, ifTrue: TapeStatement | TapeExpression) {
      super();
  
      this._condition = condition;
      this._ifTrue = (ifTrue instanceof TapeStatement.Block) ? ifTrue : new TapeStatement.Block([ifTrue]);
    }
  
    Else(ifFalse: TapeStatement | TapeExpression) : If {
      if (this._ifFalse != undefined) throw 'Else already defined for If';
      this._ifFalse = (ifFalse instanceof TapeStatement.Block) ? ifFalse : new TapeStatement.Block([ifFalse]);
      return this;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.If(this);
    }
  }

  export class For extends TapeStatement {
    private _init: TapeDefinition.Variable | TapeExpression;
    public get init(): TapeDefinition.Variable | TapeExpression {
      return this._init;
    }

    private _condition: TapeExpression;
    public get condition(): TapeExpression {
      return this._condition;
    }

    private _increment: TapeExpression;
    public get increment(): TapeExpression {
      return this._increment;
    }

    private _loop?: TapeStatement | TapeExpression;
    public get loop(): (TapeStatement | TapeExpression) {
      if (this._loop == undefined) throw `Loop is not defined for 'For' statement`;
      return this._loop;
    }

    constructor(init: TapeDefinition.Variable | TapeExpression, condition: TapeExpression, increment: TapeExpression) {
      super();
  
      this._init = init;
      this._condition = condition;
      this._increment = increment;
    }
  
    Loop(loop: TapeStatement | TapeExpression) : For {
      if (this._loop != undefined) throw 'Loop already defined for For';
      this._loop = (loop instanceof TapeStatement.Block) ? loop : new TapeStatement.Block([loop]);
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
    private _expression: TapeExpression;
    public get expression(): TapeExpression {
      return this._expression;
    }

    constructor(expression: TapeExpression) {
      super();
      this._expression = expression;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Return(this);
    }
  }
}

export { TapeStatement as TapeStatement };
