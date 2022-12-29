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
    return this.part.$Generate(generator);
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
      left: TapeValue;
      operator: BinaryOperators;
      right: TapeValue;

      constructor(left: TapeValue, operator: BinaryOperators, right: TapeValue) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Binary(this);
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
    Multuply = '*',
    Divide = '/',
    Modulo = '%'
  }

  export function Parse(expression: String) : TapeExpression {
    return undefined;
  }

  export function Empty(part: TapeExpression.Part): TapeExpression {
    return new TapeExpression(
      part
    );
  }

  export function Binary(left: TapeValue, operator: BinaryOperators, right: TapeValue) : TapeExpression {
    return new TapeExpression(
      new Part.Binary(left, operator, right)
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
}

export { TapeExpression as TapeExpression };