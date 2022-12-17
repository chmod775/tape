import * as Tape from './Tape'
import TapeDefinition = require('./TapeDefinition');
import TapeStatement = require('./TapeStatement');
import TapeType = require('./TapeType');
import TapeValue = require('./TapeValue');

export abstract class TapeGenerator {
  // Type
  abstract Type_Primitive(type: TapeType.Primitive): Tape.Code;
  abstract Type_Array(type: TapeType.Array): Tape.Code;

  // Value
  abstract Literal(value: TapeValue.Literal): Tape.Code;
  abstract Array(value: TapeValue.Array): Tape.Code;

  // Statement
  abstract Block(statement: TapeStatement.Block): Tape.Code;
  abstract If(statement: TapeStatement.If): Tape.Code;
  
  // Definition
  abstract Variable(definition: TapeDefinition.Variable): Tape.Code;
}