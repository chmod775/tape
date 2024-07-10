import { TapeGenerator } from './Core/TapeGenerator';
import { TapeValue } from './Core/Structure/TapeValue';
import { TapeStatement } from './Core/Structure/TapeStatement';
import { TapeExpression } from './Core/Structure/TapeExpression';
import { TapeCode } from './Core/TapeCode';
import { TapeProject } from './Core/TapeProject';
import { TapeType } from './Core/Structure/TapeType';
import { TapeDefinition } from './Core/Structure/TapeDefinition';
import { TapeFile } from './Core/Structure/TapeFile';
import { TapeInclude } from './Core/Structure/TapeInclude';
import { TapeStructure } from './Core/TapeStructure';

export function Block(defs: TapeStatement[] | TapeDefinition[]) : TapeStatement.Block {
  return new TapeStatement.Block(defs);
}

export function Variable(name: String, type: TapeType) : TapeDefinition.Variable {
  return new TapeDefinition.Variable(name, type);
}

export function If(condition: TapeExpression, ifTrue: TapeStatement | TapeExpression) : TapeStatement.If {
  return new TapeStatement.If(condition, ifTrue);
}

export function For(init: TapeDefinition.Variable | TapeExpression, condition: TapeExpression, increment: TapeExpression) : TapeStatement.For {
  return new TapeStatement.For(init, condition, increment);
}
export namespace For {
  export function Break() {
    return new TapeStatement.For.Break();
  }
}

export function Return(expression: TapeExpression) : TapeStatement.Return {
  return new TapeStatement.Return(expression);
}

export function CustomType(name: string, items: TapeDefinition.CustomType.Item[]): TapeDefinition.CustomType {
  return new TapeDefinition.CustomType(name, items);
}
export namespace CustomType {
  export function Item(name: String, type: TapeType) : TapeDefinition.CustomType.Item {
    return new TapeDefinition.CustomType.Item(name, type);
  }
}

export function Function(name: String, returnType?: TapeType, args?: TapeDefinition.Function.Argument[]) : TapeDefinition.Function {
  return new TapeDefinition.Function(name, returnType, args);
}
export namespace Function {
  export function Argument(name: String, type: TapeType): TapeDefinition.Function.Argument {
    return new TapeDefinition.Function.Argument(name, type);
  }

  export function ReadWriteArgument(name: String, type: TapeType): TapeDefinition.Function.Argument {
    return new TapeDefinition.Function.Argument(name, type).AsReadWrite();
  }

  export function Invoke(target: TapeValue.Symbol, args?: TapeExpression[]): TapeExpression {
    return TapeExpression.Invoke(target, args ?? []);
  }
}

export function Class(name: String, parent?: TapeDefinition.Class) {
  return new TapeDefinition.Class(name, parent);
}
export namespace Class {
  export function Field(name: String, type: TapeType) : TapeDefinition.Class.Field {
    return new TapeDefinition.Class.Field(name, type);
  }
  export function Method(name: String, returnType?: TapeType, args?: TapeDefinition.Function.Argument[]) : TapeDefinition.Class.Method {
    return new TapeDefinition.Class.Method(name, returnType, args);
  }
  export namespace Method {
    export function Argument(name: String, type: TapeType): TapeDefinition.Function.Argument {
      return new TapeDefinition.Function.Argument(name, type);
    }
  }
  export function Constructor(args?: TapeDefinition.Function.Argument[]) : TapeDefinition.Class.Method {
    return new TapeDefinition.Class.Method(null, null, args);
  }
  export function New(target: TapeValue.Symbol, args?: TapeExpression[]): TapeExpression {
    return TapeExpression.New(target, args ?? []);
  }
}

export class Value {
  static This() : TapeValue.This {
    return new TapeValue.This();
  }

  static Symbol(name: String) : TapeValue.Symbol {
    return new TapeValue.Symbol(name);
  }

  static Literal(value: any) : TapeValue.Literal {
    return new TapeValue.Literal(null, value);
  }

  static List(baseType: TapeType, ...values: TapeValue[]) : TapeValue.List {
    return new TapeValue.List(baseType, ...values);
  }
}

export class Type {
  static Primitive = TapeType.Primitive;
  
  static Custom(symbol: TapeDefinition.CustomType): TapeType.Custom {
    return new TapeType.Custom(symbol);
  }

  static Class(symbol: TapeDefinition.Class): TapeType.Class {
    return new TapeType.Class(symbol);
  }

  static List(baseType: TapeType) : TapeType.List {
    return new TapeType.List(baseType);
  }
}

export function Include(name: String, path?: String): TapeInclude {
  return new TapeInclude(name, path);
}

export function File(includes: TapeStructure[], defs: (TapeStructure)[]): TapeFile {
  return new TapeFile(includes, defs);
}

export function Project(files: TapeFile[]): TapeProject {
  return new TapeProject(files);
}

export { TapeExpression as Expression };
export { TapeGenerator as Generator };
export { TapeCode as Code };

import { GeneratorJS } from './Generators/GeneratorJS';
import { GeneratorCS } from './Generators/GeneratorCS';
import { GeneratorPY } from './Generators/GeneratorPY';
import { GeneratorC } from './Generators/GeneratorC';

export namespace Generators {
  export function JS(): GeneratorJS {
    return new GeneratorJS();
  }

  export function CS(): GeneratorCS {
    return new GeneratorCS();
  }

  export function PY(): GeneratorPY {
    return new GeneratorPY();
  }

  export function C(): GeneratorC {
    return new GeneratorC();
  }
}