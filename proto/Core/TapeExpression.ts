import TapeCode = require('./TapeCode');
import { TapeGenerator } from './TapeGenerator';
import TapeValue = require('./TapeValue');

class TapeExpression {
  part: TapeExpression.Part;

  constructor(part: TapeExpression.Part) {
    this.part = part;
  }

  Generate(generator: TapeGenerator) : TapeCode {
    return this.part.Generate(generator);
  }
}

namespace TapeExpression {
  export abstract class Part {
    abstract Generate(generator: TapeGenerator) : TapeCode;
  }

  export namespace Part {
    export class Compare extends Part {
      left: TapeValue;
      operator: CompareOperators;
      right: TapeValue;

      constructor(left: TapeValue, operator: CompareOperators, right: TapeValue) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
      }

      Generate(generator: TapeGenerator): TapeCode {
        return generator.ExpressionPart_Compare(this);
      }
    }

    export class Assign extends Part {
      target: TapeValue.Symbol;
      value: TapeValue;

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

  export enum CompareOperators {
    Equal = '==',
    NotEqual = '!=',
    Less = '<',
    Great = '>',
    LessEqual = '<=',
    GreatEqua = '>='
  }

  export function Parse(expression: String) : TapeExpression {
    return undefined;
  }

  export function Compare(left: TapeValue, operator: CompareOperators, right: TapeValue) : TapeExpression {
    return new TapeExpression(
      new Part.Compare(left, operator, right)
    );
  }

  export function Assignment(target: TapeValue.Symbol, value: TapeValue) : TapeExpression {
    return new TapeExpression(
      new Part.Assign(target, value)
    );
  }
}

export = TapeExpression;