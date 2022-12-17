import * as Tape from './Tape'
import TapeDefinition = require('./TapeDefinition');
import TapeStatement = require('./TapeStatement');
import TapeValue = require('./TapeValue');

export abstract class TapeGenerator {
  abstract Literal(value: TapeValue.Literal): Tape.Code;
  abstract Array(value: TapeValue.Array): Tape.Code;

  abstract Block(statement: TapeStatement.Block): Tape.Code;
  abstract If(statement: TapeStatement.If): Tape.Code;
  
  
  abstract Variable(definition: TapeDefinition.Variable): Tape.Code;
}

