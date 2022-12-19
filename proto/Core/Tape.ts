import TapeDefinition = require('./TapeDefinition');
import TapeExpression = require('./TapeExpression');
import TapeStatement = require('./TapeStatement');
import TapeValue = require('./TapeValue');
import TapeCode = require('./TapeCode');

import { TapeGenerator } from './TapeGenerator'
import TapeType = require('./TapeType');

export class File {
  public defs: TapeDefinition[] = [];

  constructor(defs: TapeDefinition[]) {
    this.defs = defs;
  }

  Generate(generator: TapeGenerator): TapeCode {
    let ret = new TapeCode();
    
    for (let d of this.defs)
      ret.AddCode(0, d.Generate(generator));

    return ret;
  }
}

export function Block(defs: TapeStatement[] | TapeDefinition[]) : TapeStatement.Block {
  return new TapeStatement.Block(defs);
}

export function Variable(name: String, type: TapeType) : TapeDefinition.Variable {
  return new TapeDefinition.Variable(name, type);
}

export function If(condition: TapeExpression | TapeExpression, ifTrue: TapeStatement | TapeExpression) : TapeStatement.If {
  return new TapeStatement.If(condition, ifTrue);
}

export function Function(name: String, returnType?: TapeType, args?: TapeDefinition.Function.Argument[]) : TapeDefinition.Function {
  return new TapeDefinition.Function(name, returnType, args);
}
export namespace Function {
  export function Argument(name: String, type: TapeType): TapeDefinition.Function.Argument {
    return new TapeDefinition.Function.Argument(name, type);
  }
}

export class Value {
  static Symbol(name: String) : TapeValue.Symbol {
    return new TapeValue.Symbol(name);
  }

  static Literal(value: any) : TapeValue.Literal {
    return new TapeValue.Literal(null, value);
  }

  static Array(...values: TapeValue[]) : TapeValue.Array {
    return new TapeValue.Array(null, ...values);
  }
}

export class Type {
  static Primitive = TapeType.Primitive;
  
  static Array(baseType: TapeType) : TapeType.Array {
    return new TapeType.Array(baseType);
  }
}

export { TapeExpression as Expression };
export { TapeGenerator as Generator };
export { TapeCode as Code };