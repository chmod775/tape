import * as Tape from '../Tape'
import { TapeGenerator } from '../Core/TapeGenerator';
import { TapeValue } from '../Core/Structure/TapeValue';
import { TapeStatement } from '../Core/Structure/TapeStatement';
import { TapeExpression } from '../Core/Structure/TapeExpression';
import { TapeCode } from '../Core/TapeCode';
import { TapeType } from '../Core/Structure/TapeType';
import { TapeDefinition } from '../Core/Structure/TapeDefinition';
import { TapeGlue } from '../Core/Structure/TapeGlue';
import { TapeInclude } from '../Core/Structure/TapeInclude';

const lang: string = 'c';

export class GeneratorC extends TapeGenerator {
  Name: String = lang;

  Include(include: TapeInclude): TapeCode {
    throw 'Cannot include file with C Generator';
  }

  Type_Primitive(type: TapeType.Primitive): TapeCode {
    let ret = new TapeCode(type);

    enum primitives {
      void,
      bool,
      Int8,
      Int16,
      Int32,
      Int64,
      UInt8,
      UInt16,
      UInt32,
      UInt64,
      Float,
      Double,
      String
    }

    ret.AddContent(0, `${primitives[type.code]}`)
    return ret;
  }
  Type_List(type: TapeType.List): TapeCode {
    throw 'C Generator does not include default List';
  }
  Type_Class(type: TapeType.Class): TapeCode {
    throw new Error('Method not implemented.');
  }
  Type_Custom(type: TapeType.Custom): Tape.Code {
    let ret = new TapeCode(type);
    ret.AddContent(0, `${type.def.name}`);
    return ret;
  }

  This(part: TapeValue.This): TapeCode {
    throw 'C Generator does not include this';
  }
  Symbol(part: TapeValue.Symbol): TapeCode {
    let ret = new TapeCode(part);
    if (part.source)
      ret.AddContent(0, `$0.${part.name}`, part.source.$Generate(this));
    else
      ret.AddContent(0, `${part.name}`);
    return ret;
  }
  Literal(value: TapeValue.Literal): TapeCode {
    let ret = new TapeCode(value);
    let isString = (typeof value.value === 'string' || value.value instanceof String);
    if (isString)
      ret.AddContent(0, `"${value.value}"`)
    else
      ret.AddContent(0, value.value.toString());
    return ret;
  }
  List(value: TapeValue.List): TapeCode {
    throw 'C Generator does not include default List';
  }

  Block(statement: TapeStatement.Block): TapeCode {
    let ret = new TapeCode(statement);
    ret.AddContent(0, '{');
    for (let i of statement.items) {
      let iRet = i.$Generate(this);
      if (iRet.source instanceof TapeExpression)
        ret.AddContent(1, '$0;', iRet);
      else if (iRet.source instanceof TapeDefinition.Variable)
        ret.AddContent(1, '$0;', iRet);
      else if (iRet.source instanceof TapeGlue)
        ret.AddContent(1, '$0;', iRet);
      else
        ret.AddCode(1, iRet);
    }
    ret.AddContent(0, '}');
    return ret;
  }
  If(statement: TapeStatement.If): TapeCode {
    let ret = new TapeCode(statement);
    
    ret.AddContent(0, 'if ($0)', statement.condition.$Generate(this));
    ret.AddCode(0, statement.ifTrue.$Generate(this));

    if (statement.ifFalse) {
      ret.AddContent(0, 'else');
      ret.AddCode(0, statement.ifFalse.$Generate(this));
    }

    return ret;
  }
  For(statement: TapeStatement.For): TapeCode {
    let ret = new TapeCode(statement);
    
    ret.AddContent(0, 'for ($0; $1; $2)', statement.init.$Generate(this), statement.condition.$Generate(this), statement.increment.$Generate(this));
    ret.AddCode(0, statement.loop.$Generate(this));

    return ret;
  }
  For_Break(statement: TapeStatement.For.Break): TapeCode {
    let ret = new TapeCode(statement);
    ret.AddContent(0, 'break;');
    return ret;
  }
  Return(part: TapeStatement.Return): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, 'return $0;', part.expression.$Generate(this));
    return ret;
  }

  CustomType(definition: TapeDefinition.CustomType): Tape.Code {
    let ret = new TapeCode(definition);
    ret.AddContent(0, `typedef struct {`);
    for (let item of definition.items)
      ret.AddContent(1, `$0`, item.$Generate(this));
    ret.AddContent(0, `} ${definition.name};`);
    return ret;
  }
  CustomType_Item(definition: TapeDefinition.CustomType.Item): Tape.Code {
    let ret = new TapeCode(definition);
    ret.AddContent(0, `$0 ${definition.name};`, definition.type.$Generate(this));
    return ret;
  }

  FunctionArgument(definition: TapeDefinition.Function.Argument): TapeCode {
    let ret = new TapeCode(definition);
    if (definition.IsReadWrite)
      ret.AddContent(0, `$0 *${definition.name}`, definition.type.$Generate(this));
    else
      ret.AddContent(0, `$0 ${definition.name}`, definition.type.$Generate(this));
    return ret;
  }
  Variable(definition: TapeDefinition.Variable): TapeCode {
    let ret = new TapeCode(definition);
    if (definition.init)
      ret.AddContent(0, `$0 ${definition.name} = $1`, definition.type.$Generate(this), definition.init.$Generate(this));
    else
      ret.AddContent(0, `$0 ${definition.name}`, definition.type.$Generate(this));
    return ret;
  }
  Function(definition: TapeDefinition.Function): TapeCode {
    let ret = new TapeCode(definition);
    ret.AddContent(0, `$0 ${definition.name}($,1)`, definition.returnType.$Generate(this), definition.arguments.map(a => a.$Generate(this)));
    ret.AddCode(0, definition.content.$Generate(this));
    return ret;
  }
  Field(definition: TapeDefinition.Class.Field): Tape.Code {
    throw 'C Generator does not support Fields';
  }
  Method(definition: TapeDefinition.Class.Method): Tape.Code {
    throw 'C Generator does not support Methods';
  }
  Class(definition: TapeDefinition.Class): TapeCode {
    throw 'C Generator does not support Classes';
  }

  ExpressionPart_Value(part: TapeExpression.Part.Value): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0`, part.value.$Generate(this));
    return ret;
  }
  ExpressionPart_Assign(part: TapeExpression.Part.Assign): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, '$0 = $1', part.target.$Generate(this), part.value.$Generate(this));
    return ret;
  }
  ExpressionPart_Binary(part: TapeExpression.Part.Binary): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0 ${part.operator} $1`, part.left.$Generate(this), part.right.$Generate(this));
    return ret;
  }
  ExpressionPart_Ternary(part: Tape.Expression.Part.Ternary): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0 ? $1 : $2`, part.condition.$Generate(this), part._true.$Generate(this), part._false.$Generate(this));
    return ret;
  }
  ExpressionPart_Relational(part: TapeExpression.Part.Relational): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0 ${part.operator} $1`, part.left.$Generate(this), part.right.$Generate(this));
    return ret;
  }
  ExpressionPart_Invoke(part: TapeExpression.Part.Invoke): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0($,1)`, part.target.$Generate(this), part.args.map(v => v.$Generate(this)));
    return ret;
  }
  ExpressionPart_New(part: TapeExpression.Part.New): TapeCode {
    throw 'C Generator does not support New operator';
  }
  ExpressionPart_Index(part: TapeExpression.Part.Index): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0[$1]`, part.target.$Generate(this), part.index.$Generate(this));
    return ret;
  }
}