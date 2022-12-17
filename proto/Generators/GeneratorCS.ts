import TapeCode = require('../Core/TapeCode');
import TapeDefinition = require('../Core/TapeDefinition');
import TapeExpression = require('../Core/TapeExpression');
import { TapeGenerator } from '../Core/TapeGenerator';
import TapeStatement = require('../Core/TapeStatement');
import TapeType = require('../Core/TapeType');
import TapeValue = require('../Core/TapeValue');

export class GeneratorCS extends TapeGenerator {
  Type_Primitive(type: TapeType.Primitive): TapeCode {
    return new TapeCode(TapeType._PrimitiveCodes[type.code]);
  }
  Type_Array(type: TapeType.Array): TapeCode {
    return new TapeCode(`List<${type.baseType.Generate(this).Content()}>`);
  }
  
  Literal(value: TapeValue.Literal): TapeCode {
    let isString = (typeof value.value === 'string' || value.value instanceof String);
    if (isString)
      return new TapeCode(`"${value.value}"`);
    else
      return new TapeCode(value.value);
  }
  Array(value: TapeValue.Array): TapeCode {
    let last = this.stack[this.stack.length - 1] as TapeDefinition.Variable;
    let line = `new ${last.type.Generate(this).Content()}() {`;

    let items: String[] = [];
    for (var i of value.values)
      items.push(i.Generate(this).Content());
    line += items.join(',');

    line += '}';
    return new TapeCode(line);
  }

  Block(statement: TapeStatement.Block): TapeCode {
    let ret = new TapeCode();

    ret.AddString(0, '{');

    for (let i of statement.items) {
      let iRet = i.Generate(this);

      ret.AddCode(1, iRet);
    }

    ret.AddString(0, '}');

    return ret;
  }
  If(statement: TapeStatement.If): TapeCode {
    let ret = new TapeCode();
    
    ret.AddString(0, `if (${statement.condition.Generate(this).Content()})`);
    ret.AddCode(0, statement.ifTrue.Generate(this));

    if (statement.ifFalse) {
      ret.AddString(0, `else`);
      ret.AddCode(0, statement.ifFalse.Generate(this));
    }

    return ret;
  }

  Variable(definition: TapeDefinition.Variable): TapeCode {
    this.stack.push(definition);
    let line = `${definition.type.Generate(this).Content()} ${definition.name}`;
    if (definition.init)
      line += ` = ${definition.init.Generate(this).Content()}`;

    this.stack.pop();
    return new TapeCode(line + ';');
  }
  Function(definition: TapeDefinition.Function): TapeCode {
    let ret = new TapeCode();

    let args = [];
    for (let a of definition.arguments) {
      args.push(`${a.type.Generate(this).Content()} ${a.name}`);
    }

    ret.AddString(0, `${definition.returnType ? definition.returnType.Generate(this).Content() : 'void'} ${definition.name}(${args.join(',')})`);
    ret.AddCode(0, definition.content.Generate(this));

    return ret;
  }

  ExpressionPart_Assign(part: TapeExpression.Part.Assign): TapeCode {
    return new TapeCode(
      `${part.target.Generate(this).Content()} = ${part.value.Generate(this).Content()}`
    );
  }
  ExpressionPart_Compare(part: TapeExpression.Part.Compare): TapeCode {
    return new TapeCode(
      `${part.left.Generate(this).Content()} ${part.operator} ${part.right.Generate(this).Content()}`
    );
  }
}