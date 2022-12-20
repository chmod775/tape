import { TapeGenerator } from '../TapeGenerator';
import { TapeValue } from './TapeValue';
import { TapeCode } from '../TapeCode';
import { TapeStructure } from '../TapeStructure';
import { TapeScope } from '../TapeScope';

class TapeExpression extends TapeStructure {
  part: TapeExpression.Part;

  constructor(part: TapeExpression.Part) {
    super();
    this.part = part;
  }

  Substructure(): TapeStructure[] {
    return [ this.part ];
  }
  
  Generate(generator: TapeGenerator) : TapeCode {
    return this.part.Generate(generator);
  }
}

namespace TapeExpression {
  export abstract class Part extends TapeStructure {
  }

  export namespace Part {
    export class Value extends Part {
      value: TapeValue;

      Substructure(): TapeStructure[] {
        return [
          this.value
        ];
      }

      constructor(value: TapeValue) {
        super();
        this.value = value;
      }

      Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Value(this);
      }
    }

    export class Binary extends Part {
      left: TapeValue;
      operator: BinaryOperators;
      right: TapeValue;

      Substructure(): TapeStructure[] {
        return [
          this.left,
          this.right
        ];
      }

      constructor(left: TapeValue, operator: BinaryOperators, right: TapeValue) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
      }

      Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Binary(this);
      }
    }

    export class Relational extends Part {
      left: TapeValue;
      operator: RelationalOperators;
      right: TapeValue;

      Substructure(): TapeStructure[] {
        return [
          this.left,
          this.right
        ];
      }

      constructor(left: TapeValue, operator: RelationalOperators, right: TapeValue) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
      }

      Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Relational(this);
      }
    }

    export class Assign extends Part {
      target: TapeValue.Symbol;
      value: TapeValue;

      Substructure(): TapeStructure[] {
        return [
          this.target,
          this.value
        ];
      }

      constructor(target: TapeValue.Symbol, value: TapeValue) {
        super();
        this.target = target;
        this.value = value;
      }

      Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Assign(this);
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

  export function Binary(left: TapeValue, operator: BinaryOperators, right: TapeValue) : TapeExpression {
    return new TapeExpression(
      new Part.Binary(left, operator, right)
    );
  }

  export function Relational(left: TapeValue, operator: RelationalOperators, right: TapeValue) : TapeExpression {
    return new TapeExpression(
      new Part.Relational(left, operator, right)
    );
  }

  export function Assignment(target: TapeValue.Symbol, value: TapeValue) : TapeExpression {
    return new TapeExpression(
      new Part.Assign(target, value)
    );
  }

  export function Value(value: TapeValue) : TapeExpression {
    return new TapeExpression(
      new Part.Value(value)
    );
  }
}

export { TapeExpression as TapeExpression };