import { TapeGenerator } from '../Core/TapeGenerator';
import { TapeValue } from '../Core/TapeValue';
import { TapeStatement } from '../Core/TapeStatement';
import { TapeExpression } from '../Core/TapeExpression';
import { TapeCode } from '../Core/TapeCode';
import { TapeType } from '../Core/TapeType';
import { TapeDefinition } from '../Core/TapeDefinition';

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

export function If(condition: TapeExpression, ifTrue: TapeStatement | TapeExpression) : TapeStatement.If {
  return new TapeStatement.If(condition, ifTrue);
}

export function Return(expression: TapeExpression) : TapeStatement.Return {
  return new TapeStatement.Return(expression);
}

export function Function(name: String, returnType?: TapeType, args?: TapeDefinition.Function.Argument[]) : TapeDefinition.Function {
  return new TapeDefinition.Function(name, returnType, args);
}
export namespace Function {
  export function Argument(name: String, type: TapeType): TapeDefinition.Function.Argument {
    return new TapeDefinition.Function.Argument(name, type);
  }
}

export function Class(name: String, parent?: TapeDefinition.Class) {
  return new TapeDefinition.Class(name, parent);
}
export namespace Class {
  export function Field(name: String, type: TapeType) : TapeDefinition.Field {
    return new TapeDefinition.Field(name, type);
  }
  export function Method(name: String, returnType?: TapeType, args?: TapeDefinition.Function.Argument[]) : TapeDefinition.Method {
    return new TapeDefinition.Method(name, returnType, args);
  }
  export namespace Method {
    export function Argument(name: String, type: TapeType): TapeDefinition.Function.Argument {
      return new TapeDefinition.Function.Argument(name, type);
    }
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