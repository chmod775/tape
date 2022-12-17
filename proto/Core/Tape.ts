import * as TapeDefinition from './TapeDefinition'
import * as TapeExpression from './TapeExpression'
import * as TapeStatement from './TapeStatement'
import * as TapeValue from './TapeValue'
import { TapeGenerator } from './TapeGenerator'

export abstract class Base {
  abstract Generate(generator: TapeGenerator) : Code;
}

export function Block(defs: TapeStatement.Base[] | TapeDefinition.Base[]) : TapeStatement.Block {
  let ret = new TapeStatement.Block(defs);
  return ret;
}

export function Variable(name: String, type: DataTypes) : TapeDefinition.Variable {
  let ret = new TapeDefinition.Variable(name, type);
  return ret;
}

export function If(condition: TapeExpression.Base, def: TapeDefinition.Base) : TapeStatement.If {
  let ret = new TapeStatement.If(condition, def);
  return ret;
}

export class Code {
  lines: String[] = [];

  constructor(singleLine?: String) {
    if (singleLine != undefined)
      this.lines.push(singleLine);
  }

  Content() {
    return this.lines.join('\n');
  }
}

export class Value {
  static Symbol(name: String) : TapeValue.Symbol {
    return new TapeValue.Symbol(name);
  }

  static Literal(value: any) : TapeValue.Literal {
    return new TapeValue.Literal(value);
  }

  static Array(...values: TapeValue.Base[]) : TapeValue.Array {
    return new TapeValue.Array(...values);
  }
}

export { TapeExpression as Expression };
export { TapeGenerator as Generator };

export enum DataTypes {
  Int8,
  Int16,
  Int32,
  Int64,
  UInt8,
  UInt16,
  UInt32,
  UInt64,
  Float,
  Double,
  String
}