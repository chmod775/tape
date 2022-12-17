import * as Tape from '../Core/Tape'
import TapeDefinition = require('../Core/TapeDefinition');
import TapeStatement = require('../Core/TapeStatement');
import TapeType = require('../Core/TapeType');
import TapeValue = require('../Core/TapeValue');

export class GeneratorCS extends Tape.Generator {
  Type_Primitive(type: TapeType.Primitive): Tape.Code {
    return new Tape.Code(TapeType._PrimitiveCodes[type.code]);
  }
  Type_Array(type: TapeType.Array): Tape.Code {
    return new Tape.Code(`${type.baseType.Generate(this).Content()}[]`);
  }
  
  Literal(value: TapeValue.Literal): Tape.Code {
    let isString = (typeof value.value === 'string' || value.value instanceof String);
    if (isString)
      return new Tape.Code(`"${value.value}"`);
    else
      return new Tape.Code(value.value);
  }

  Array(value: TapeValue.Array): Tape.Code {
    let line = '[';

    let items: String[] = [];
    for (var i of value.values)
      items.push(i.Generate(this).Content());
    line += items.join(',');

    line += ']';
    return new Tape.Code(line);
  }

  Block(statement: TapeStatement.Block): Tape.Code {
    let ret = new Tape.Code();

    for (let i of statement.items) {
      let iRet = i.Generate(this);
      ret.lines.push(...iRet.lines);
    }

    return ret;
  }
  
  If(statement: TapeStatement.If): Tape.Code {
    return new Tape.Code();
  }

  Variable(definition: TapeDefinition.Variable): Tape.Code {
    let line = `${definition.type.Generate(this).Content()} ${definition.name}`;
    if (definition.init)
      line += ` = ${definition.init.Generate(this).Content()}`;

    return new Tape.Code(line + ';');
  }
}