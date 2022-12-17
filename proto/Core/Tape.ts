import TapeDefinition = require('./TapeDefinition');
import TapeExpression = require('./TapeExpression');
import TapeStatement = require('./TapeStatement');
import TapeValue = require('./TapeValue');

import { TapeGenerator } from './TapeGenerator'
import TapeType = require('./TapeType');

export abstract class Base {
  abstract Generate(generator: TapeGenerator) : Code;
}

export function Block(defs: TapeStatement[] | TapeDefinition[]) : TapeStatement.Block {
  let ret = new TapeStatement.Block(defs);
  return ret;
}

export function Variable(name: String, type: TapeType) : TapeDefinition.Variable {
  let ret = new TapeDefinition.Variable(name, type);
  return ret;
}

export function If(condition: TapeExpression, def: TapeDefinition) : TapeStatement.If {
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

  static Array(...values: TapeValue[]) : TapeValue.Array {
    return new TapeValue.Array(...values);
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