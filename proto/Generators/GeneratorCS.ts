import * as Tape from '../Core/Tape'
import { Block, If } from '../Core/TapeStatement';
import { Variable } from '../Core/TapeDefinition';
import { Array, Literal } from '../Core/TapeValue';

export class GeneratorCS extends Tape.Generator {
  Literal(value: Literal): Tape.Code {
    let isString = (typeof value.value === 'string' || value.value instanceof String);
    if (isString)
      return new Tape.Code(`"${value.value}"`);
    else
      return new Tape.Code(value.value);
  }

  Array(value: Array): Tape.Code {
    let line = '[';

    let items: String[] = [];
    for (var i of value.values)
      items.push(i.Generate(this).Content());
    line += items.join(',');

    line += ']';
    return new Tape.Code(line);
  }

  Block(statement: Block): Tape.Code {
    let ret = new Tape.Code();

    for (let i of statement.defs) {
      let iRet = i.Generate(this);
      ret.lines.push(...iRet.lines);
    }

    return ret;
  }
  
  If(statement: If): Tape.Code {
    return new Tape.Code();
  }

  Variable(definition: Variable): Tape.Code {
    let line = `${GeneratorCS.DataTypes[definition.type]} ${definition.name}`;
    if (definition.init)
      line += ` = ${definition.init.Generate(this).Content()}`;

    return new Tape.Code(line + ';');
  }
}

export namespace GeneratorCS {
  export enum DataTypes {
    Int8,
    Int16,
    Int32,
    Int64,
    UInt8,
    UInt16,
    UInt32,
    UInt64,
    float,
    double,
    string
  }
}