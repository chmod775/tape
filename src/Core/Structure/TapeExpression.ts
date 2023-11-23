import { TapeGenerator } from '../TapeGenerator';
import { TapeValue } from './TapeValue';
import { TapeCode } from '../TapeCode';
import { TapeStructure } from '../TapeStructure';
import { TapeScope } from '../TapeScope';
import { TapeDefinition } from './TapeDefinition';

class TapeExpression extends TapeStructure {
  part: TapeExpression.Part;

  constructor(part: TapeExpression.Part) {
    super();
    this.part = part;
  }
  
  $Generate(generator: TapeGenerator) : TapeCode {
    let ret = new TapeCode(this);
    ret.AddContent(0, '$0', this.part.$Generate(generator));
    return ret;
  }
}

namespace TapeExpression {
  export abstract class Part extends TapeStructure {
  }

  export namespace Part {
    export class Value extends Part {
      value: TapeValue;

      constructor(value: TapeValue) {
        super();
        this.value = value;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Value(this);
      }
    }

    export class Binary extends Part {
      left: TapeExpression;
      operator: BinaryOperators;
      right: TapeExpression;

      constructor(left: TapeValue | TapeExpression, operator: BinaryOperators, right: TapeValue | TapeExpression) {
        super();
        this.left = (left instanceof TapeExpression) ? left : TapeExpression.Value(left as TapeValue);
        this.operator = operator;
        this.right = (right instanceof TapeExpression) ? right : TapeExpression.Value(right as TapeValue);
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Binary(this);
      }
    }

    export class Ternary extends Part {
      condition: TapeExpression;
      _true: TapeExpression;
      _false: TapeExpression;

      constructor(condition: TapeExpression, _true: TapeValue | TapeExpression, _false: TapeValue | TapeExpression) {
        super();
        this.condition = condition;
        this._true = (_true instanceof TapeExpression) ? _true : TapeExpression.Value(_true as TapeValue);
        this._false = (_false instanceof TapeExpression) ? _false : TapeExpression.Value(_false as TapeValue);
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Ternary(this);
      }
    }

    export class Relational extends Part {
      left: TapeExpression;
      operator: RelationalOperators;
      right: TapeExpression;

      constructor(left: TapeValue | TapeExpression, operator: RelationalOperators, right: TapeValue | TapeExpression) {
        super();
        this.left = (left instanceof TapeExpression) ? left : TapeExpression.Value(left as TapeValue);
        this.operator = operator;
        this.right = (right instanceof TapeExpression) ? right : TapeExpression.Value(right as TapeValue);
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Relational(this);
      }
    }

    export class Assign extends Part {
      target: TapeValue.Symbol;
      value: TapeExpression;

      constructor(target: TapeValue.Symbol, value: TapeExpression) {
        super();
        this.target = target;
        this.value = value;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Assign(this);
      }
    }

    export class Invoke extends Part {
      target: TapeValue.Symbol;
      args: TapeExpression[];

      constructor(target: TapeValue.Symbol, args: TapeExpression[]) {
        super();
        this.target = target;
        this.args = args;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Invoke(this);
      }
    }

    export class New extends Part {
      target: TapeValue.Symbol;
      args: TapeExpression[];

      constructor(target: TapeValue.Symbol, args: TapeExpression[]) {
        super();
        this.target = target;
        this.args = args;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_New(this);
      }
    }

    export class Index extends Part {
      target: TapeExpression;
      index: TapeExpression;

      constructor(target: TapeExpression, index: TapeExpression) {
        super();
        this.target = target;
        this.index = index;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Index(this);
      }
    }
  }

  export enum RelationalOperators {
    Equal = '==',
    NotEqual = '!=',
    Less = '<',
    Great = '>',
    LessEqual = '<=',
    GreatEqua = '>='
  }

  export enum BinaryOperators {
    Add = '+',
    Subtract = '-',
    Multiply = '*',
    Divide = '/',
    Modulo = '%',
    And = '&',
    Or = '|',
    LogicAnd = '&&',
    LogicOr = '||'
  }

  export function Parse(expression: String) : TapeExpression {
    return undefined;
  }

  export function Empty(part: TapeExpression.Part): TapeExpression {
    return new TapeExpression(
      part
    );
  }

  export function Binary(left: TapeValue | TapeExpression, operator: BinaryOperators, right: TapeValue | TapeExpression) : TapeExpression {
    return new TapeExpression(
      new Part.Binary(left, operator, right)
    );
  }

  export function Ternary(condition: TapeExpression, _true: TapeValue | TapeExpression, _false: TapeValue | TapeExpression) : TapeExpression {
    return new TapeExpression(
      new Part.Ternary(condition, _true, _false)
    );
  }

  export function Relational(left: TapeValue | TapeExpression, operator: RelationalOperators, right: TapeValue | TapeExpression) : TapeExpression {
    return new TapeExpression(
      new Part.Relational(left, operator, right)
    );
  }

  export function Assignment(target: TapeValue.Symbol, value: TapeExpression) : TapeExpression {
    return new TapeExpression(
      new Part.Assign(target, value)
    );
  }

  export function Value(value: TapeValue) : TapeExpression {
    return new TapeExpression(
      new Part.Value(value)
    );
  }

  export function Invoke(target: TapeValue.Symbol, args: TapeExpression[]) : TapeExpression {
    return new TapeExpression(
      new Part.Invoke(target, args)
    );
  }

  export function New(target: TapeValue.Symbol, args: TapeExpression[]) : TapeExpression {
    return new TapeExpression(
      new Part.New(target, args)
    );
  }

  export function Index(target: TapeExpression, index: TapeExpression) : TapeExpression {
    return new TapeExpression(
      new Part.Index(target, index)
    );
  }
}

export { TapeExpression as TapeExpression };