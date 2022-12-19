import { TapeGenerator } from '../Core/TapeGenerator';
import { TapeValue } from '../Core/Structure/TapeValue';
import { TapeStatement } from '../Core/Structure/TapeStatement';
import { TapeExpression } from '../Core/Structure/TapeExpression';
import { TapeCode } from '../Core/TapeCode';
import { TapeType } from '../Core/Structure/TapeType';
import { TapeDefinition } from '../Core/Structure/TapeDefinition';

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
    let line = `new ${value.baseType.Generate(this).Content()}() {`;

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
  Return(part: TapeStatement.Return): TapeCode {
    return new TapeCode(`return ${part.expression.Generate(this).Content()};`);
  }

  Variable(definition: TapeDefinition.Variable): TapeCode {
    let line = `${definition.type.Generate(this).Content()} ${definition.name}`;
    if (definition.init)
      line += ` = ${definition.init.Generate(this).Content()}`;
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
  Class(definition: TapeDefinition.Class): TapeCode {
    let ret = new TapeCode();

    ret.AddString(0, `class ${definition.name} {`);

    for (let f of definition.fields) {
      let line = `${f.type.Generate(this).Content()} ${f.name}`;
      if (f.init)
        line += ` = ${f.init.Generate(this).Content()}`;
      ret.AddString(1, line + ';');
    }

    for (let c of definition.constructors) {
      let args = c.arguments.map(a => a.name);
      ret.AddString(1, `${c.name}(${args.join(',')})`)
      ret.AddCode(1, c.content.Generate(this));
    }

    for (let m of definition.methods) {
      let args = m.arguments.map(a => a.name);
      ret.AddString(1, `${m.returnType ? m.returnType.Generate(this).Content() : 'void'} ${m.name}(${args.join(',')})`)
      ret.AddCode(1, m.content.Generate(this));
    }

    ret.AddString(0, `}`);

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