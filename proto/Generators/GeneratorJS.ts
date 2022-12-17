import * as Tape from '../Core/Tape'
import { Block, If } from '../Core/TapeStatement';
import { Variable } from '../Core/TapeDefinition';

export class GeneratorJS extends Tape.Generator {
  Block(statement: Block): Tape.Code {
    let ret = new Tape.Code();

    for (let i of statement.defs) {
      let iRet = i.Generate(this);
      ret.lines.push(...iRet.lines);
    }

    return ret;
  }
  If(statement: If): Tape.Code {
  }

  Variable(definition: Variable): Tape.Code {
    let line = `var ${definition.name}`;
    if (definition.init)
      line += ` = ${definition.init}`;

    return new Tape.Code(line);
  }
}