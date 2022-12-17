import TapeCode = require('./TapeCode');
import TapeDefinition = require('./TapeDefinition');
import TapeExpression = require('./TapeExpression');
import TapeStatement = require('./TapeStatement');
import TapeType = require('./TapeType');
import TapeValue = require('./TapeValue');

export abstract class TapeGenerator {
  public stack: TapeStatement[] | TapeDefinition[] = [];

  //Invoke<T : 

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
  abstract ExpressionPart_Assign(part: TapeExpression.Part.Assign): TapeCode;
  abstract ExpressionPart_Compare(part: TapeExpression.Part.Compare): TapeCode;
}

export namespace TapeGenerator {

}