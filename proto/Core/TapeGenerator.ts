import * as Tape from './Tape'
import * as TapeDefinition from './TapeDefinition'
import * as TapeExpression from './TapeExpression'
import * as TapeStatement from './TapeStatement'
import * as TapeValue from './TapeValue'

export abstract class TapeGenerator {
  abstract Literal(value: TapeValue.Literal): Tape.Code;
  abstract Array(value: TapeValue.Array): Tape.Code;

  abstract Block(statement: TapeStatement.Block): Tape.Code;
  abstract If(statement: TapeStatement.If): Tape.Code;
  
  
  abstract Variable(definition: TapeDefinition.Variable): Tape.Code;
}

