import { TapeGenerator } from '../Core/TapeGenerator';
import { TapeValue } from './Structure/TapeValue';
import { TapeStatement } from './Structure/TapeStatement';
import { TapeExpression } from './Structure/TapeExpression';
import { TapeCode } from '../Core/TapeCode';
import { TapeType } from './Structure/TapeType';
import { TapeDefinition } from './Structure/TapeDefinition';
import { TapeFile } from './Structure/TapeFile';

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
export { TapeFile as File };