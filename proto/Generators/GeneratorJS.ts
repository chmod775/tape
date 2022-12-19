import { TapeGenerator } from '../Core/TapeGenerator';
import { TapeValue } from '../Core/TapeValue';
import { TapeStatement } from '../Core/TapeStatement';
import { TapeExpression } from '../Core/TapeExpression';
import { TapeCode } from '../Core/TapeCode';
import { TapeType } from '../Core/TapeType';
import { TapeDefinition } from '../Core/TapeDefinition';

export class GeneratorJS extends TapeGenerator {
  Type_Primitive(type: TapeType.Primitive): TapeCode {
    throw new Error('Method not implemented.');
  }
  Type_Array(type: TapeType.Array): TapeCode {
    throw new Error('Method not implemented.');
  }
  
  Literal(value: TapeValue.Literal): TapeCode {
    let isString = (typeof value.value === 'string' || value.value instanceof String);
    if (isString)
      return new TapeCode(`"${value.value}"`);
    else
      return new TapeCode(value.value);
  }
  Array(value: TapeValue.Array): TapeCode {
    let line = '[';

    let items: String[] = [];
    for (var i of value.values)
      items.push(i.Generate(this).Content());
    line += items.join(',');

    line += ']';
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
    let line = `var ${definition.name}`;
    if (definition.init)
      line += ` = ${definition.init.Generate(this).Content()}`;

    return new TapeCode(line + ';');
  }
  Function(definition: TapeDefinition.Function): TapeCode {
    let ret = new TapeCode();

    let args = [];
    for (let a of definition.arguments) {
      args.push(`${a.name}`);
    }

    ret.AddString(0, `function ${definition.name}(${args.join(',')})`);
    ret.AddCode(0, definition.content.Generate(this));

    return ret;
  }

  ExpressionPart_Value(part: TapeExpression.Part.Value): TapeCode {
    return new TapeCode(
      `${part.value.Generate(this).Content()}`
    );
  }
  ExpressionPart_Assign(part: TapeExpression.Part.Assign): TapeCode {
    return new TapeCode(
      `${part.target.Generate(this).Content()} = ${part.value.Generate(this).Content()}`
    );
  }
  ExpressionPart_Binary(part: TapeExpression.Part.Binary): TapeCode {
    return new TapeCode(
      `${part.left.Generate(this).Content()} ${part.operator} ${part.right.Generate(this).Content()}`
    );
  }
  ExpressionPart_Relational(part: TapeExpression.Part.Relational): TapeCode {
    return new TapeCode(
      `${part.left.Generate(this).Content()} ${part.operator} ${part.right.Generate(this).Content()}`
    );
  }
}