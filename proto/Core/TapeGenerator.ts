import { TapeValue } from './Structure/TapeValue';
import { TapeStatement } from './Structure/TapeStatement';
import { TapeExpression } from './Structure/TapeExpression';
import { TapeCode } from './TapeCode';
import { TapeType } from './Structure/TapeType';
import { TapeDefinition } from './Structure/TapeDefinition';

export abstract class TapeGenerator {
  abstract Name: String;
  
  // Type
  abstract Type_Primitive(type: TapeType.Primitive): TapeCode;
  abstract Type_Array(type: TapeType.Array): TapeCode;

  // Value
  abstract This(part: TapeValue.This): TapeCode;
  abstract Symbol(part: TapeValue.Symbol): TapeCode;
  abstract Literal(value: TapeValue.Literal): TapeCode;
  abstract Array(value: TapeValue.Array): TapeCode;

  // Statement
  abstract Block(statement: TapeStatement.Block): TapeCode;
  abstract If(statement: TapeStatement.If): TapeCode;
  abstract Return(part: TapeStatement.Return): TapeCode;
  
  // Definition
  abstract Variable(definition: TapeDefinition.Variable): TapeCode;
  
  abstract Function(definition: TapeDefinition.Function): TapeCode;
  abstract FunctionArgument(definition: TapeDefinition.Function.Argument): TapeCode;

  abstract Class(definition: TapeDefinition.Class): TapeCode;

  // Expression
  abstract ExpressionPart_Value(part: TapeExpression.Part.Value): TapeCode;
  abstract ExpressionPart_Assign(part: TapeExpression.Part.Assign): TapeCode;
  abstract ExpressionPart_Binary(part: TapeExpression.Part.Binary): TapeCode;
  abstract ExpressionPart_Relational(part: TapeExpression.Part.Relational): TapeCode;
  abstract ExpressionPart_Invoke(part: TapeExpression.Part.Invoke): TapeCode;
}

export namespace TapeGenerator {

}