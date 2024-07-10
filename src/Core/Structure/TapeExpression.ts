import { TapeGenerator } from '../TapeGenerator';
import { TapeValue } from './TapeValue';
import { TapeCode } from '../TapeCode';
import { TapeStructure } from '../TapeStructure';

class TapeExpression extends TapeStructure {
  private _part: TapeExpression.Part;
  public get part(): TapeExpression.Part {
    return this._part;
  }

  constructor(part: TapeExpression.Part) {
    super();
    this._part = part;
  }
  
  $Generate(generator: TapeGenerator) : TapeCode {
    let ret = new TapeCode(this);
    ret.AddContent(0, '$0', this._part.$Generate(generator));
    return ret;
  }
}

namespace TapeExpression {
  export abstract class Part extends TapeStructure {
  }

  export namespace Part {
    export class Value extends Part {
      private _value: TapeValue;
      public get value(): TapeValue {
        return this._value;
      }

      constructor(value: TapeValue) {
        super();
        this._value = value;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Value(this);
      }
    }

    export class Binary extends Part {
      private _left: TapeExpression;
      public get left(): TapeExpression {
        return this._left;
      }

      private _operator: BinaryOperators;
      public get operator(): BinaryOperators {
        return this._operator;
      }

      private _right: TapeExpression;
      public get right(): TapeExpression {
        return this._right;
      }

      constructor(left: TapeValue | TapeExpression, operator: BinaryOperators, right: TapeValue | TapeExpression) {
        super();
        this._left = (left instanceof TapeExpression) ? left : TapeExpression.Value(left as TapeValue);
        this._operator = operator;
        this._right = (right instanceof TapeExpression) ? right : TapeExpression.Value(right as TapeValue);
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Binary(this);
      }
    }

    export class Ternary extends Part {
      private _condition: TapeExpression;
      public get condition(): TapeExpression {
        return this._condition;
      }

      private _true: TapeExpression;
      public get true(): TapeExpression {
        return this._true;
      }

      private _false: TapeExpression;
      public get false(): TapeExpression {
        return this._false;
      }

      constructor(condition: TapeExpression, _true: TapeValue | TapeExpression, _false: TapeValue | TapeExpression) {
        super();
        this._condition = condition;
        this._true = (_true instanceof TapeExpression) ? _true : TapeExpression.Value(_true as TapeValue);
        this._false = (_false instanceof TapeExpression) ? _false : TapeExpression.Value(_false as TapeValue);
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Ternary(this);
      }
    }

    export class Relational extends Part {
      private _left: TapeExpression;
      public get left(): TapeExpression {
        return this._left;
      }

      private _operator: RelationalOperators;
      public get operator(): RelationalOperators {
        return this._operator;
      }

      private _right: TapeExpression;
      public get right(): TapeExpression {
        return this._right;
      }

      constructor(left: TapeValue | TapeExpression, operator: RelationalOperators, right: TapeValue | TapeExpression) {
        super();
        this._left = (left instanceof TapeExpression) ? left : TapeExpression.Value(left as TapeValue);
        this._operator = operator;
        this._right = (right instanceof TapeExpression) ? right : TapeExpression.Value(right as TapeValue);
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Relational(this);
      }
    }

    export class Assign extends Part {
      private _target: TapeValue.Symbol;
      public get target(): TapeValue.Symbol {
        return this._target;
      }

      private _value: TapeExpression;
      public get value(): TapeExpression {
        return this._value;
      }

      constructor(target: TapeValue.Symbol, value: TapeExpression) {
        super();
        this._target = target;
        this._value = value;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Assign(this);
      }
    }

    export class Invoke extends Part {
      private _target: TapeValue.Symbol;
      public get target(): TapeValue.Symbol {
        return this._target;
      }

      private _args: TapeExpression[];
      public get args(): ReadonlyArray<TapeExpression> {
        return this._args;
      }

      constructor(target: TapeValue.Symbol, args: TapeExpression[]) {
        super();
        this._target = target;
        this._args = args;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Invoke(this);
      }
    }

    export class New extends Part {
      private _target: TapeValue.Symbol;
      public get target(): TapeValue.Symbol {
        return this._target;
      }

      private _args: TapeExpression[];
      public get args(): ReadonlyArray<TapeExpression> {
        return this._args;
      }

      constructor(target: TapeValue.Symbol, args: TapeExpression[]) {
        super();
        this._target = target;
        this._args = args;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_New(this);
      }
    }

    export class Index extends Part {
      private _target: TapeExpression;
      public get target(): TapeExpression {
        return this._target;
      }

      private _index: TapeExpression;
      public get index(): TapeExpression {
        return this._index;
      }

      constructor(target: TapeExpression, index: TapeExpression) {
        super();
        this._target = target;
        this._index = index;
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
    throw 'Not implemented';
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