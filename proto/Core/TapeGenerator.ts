import { TapeValue } from './TapeValue';
import { TapeStatement } from './TapeStatement';
import { TapeExpression } from './TapeExpression';
import { TapeCode } from './TapeCode';
import { TapeType } from './TapeType';
import { TapeDefinition } from './TapeDefinition';

export abstract class TapeGenerator {
  // Type
  abstract Type_Primitive(type: TapeType.Primitive): TapeCode;
  abstract Type_Array(type: TapeType.Array): TapeCode;

  // Value
  abstract Literal(value: TapeValue.Literal): TapeCode;
  abstract Array(value: TapeValue.Array): TapeCode;

  // Statement
  abstract Block(statement: TapeStatement.Block): TapeCode;
  abstract If(statement: TapeStatement.If): TapeCode;
  
  // Definition
  abstract Variable(definition: TapeDefinition.Variable): TapeCode;
  abstract Function(definition: TapeDefinition.Function): TapeCode;

  // Expression
  abstract ExpressionPart_Value(part: TapeExpression.Part.Value): TapeCode;
  abstract ExpressionPart_Assign(part: TapeExpression.Part.Assign): TapeCode;
  abstract ExpressionPart_Binary(part: TapeExpression.Part.Binary): TapeCode;
  abstract ExpressionPart_Relational(part: TapeExpression.Part.Relational): TapeCode;
}

export namespace TapeGenerator {

}