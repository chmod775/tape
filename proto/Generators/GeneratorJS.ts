import { TapeGenerator } from '../Core/TapeGenerator';
import { TapeValue } from '../Core/Structure/TapeValue';
import { TapeStatement } from '../Core/Structure/TapeStatement';
import { TapeExpression } from '../Core/Structure/TapeExpression';
import { TapeCode } from '../Core/TapeCode';
import { TapeType } from '../Core/Structure/TapeType';
import { TapeDefinition } from '../Core/Structure/TapeDefinition';

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
  Return(part: TapeStatement.Return): TapeCode {
    return new TapeCode(`return ${part.expression.Generate(this).Content()};`);
  }

  Variable(definition: TapeDefinition.Variable): TapeCode {
    let line = `var ${definition.name}`;
    if (definition.init)
      line += ` = ${definition.init.Generate(this).Content()}`;

    return new TapeCode(line + ';');
  }
  Function(definition: TapeDefinition.Function): TapeCode {
    return GeneratorJS.Utils.GenerateCallable(this, definition, { isMethod: false, isConstructor: false });
  }
  Class(definition: TapeDefinition.Class): TapeCode {
    let ret = new TapeCode();

    ret.AddString(0, `class ${definition.name} {`);

    let initializedFields = definition.fields.filter(f => f.init);
    if (initializedFields.length > 0) {
      // Create __init method to call every constructor
      let initFnContent: TapeExpression[] = [];
      for (let f of initializedFields) {
        initFnContent.push(TapeExpression.Assignment(new TapeValue.Symbol(`this.${f.name}`), f.init))
      }

      let initFn = new TapeDefinition.Function('__init').Content(initFnContent);
      ret.AddCode(1, GeneratorJS.Utils.GenerateCallable(this, initFn, { isMethod: true, isConstructor: false }));

      if (definition.constructors.length == 0) { // If not constructors defined, define a default one with no arguments
        let initConstructorContent: TapeExpression[] = [];
        let initConstructor = new TapeDefinition.Method('').Content(initConstructorContent);
        ret.AddCode(1, GeneratorJS.Utils.GenerateCallable(this, initConstructor, { isMethod: false, isConstructor: true }));
      }
    }



    for (let c of definition.constructors)
      ret.AddCode(1, GeneratorJS.Utils.GenerateCallable(this, c, { isMethod: false, isConstructor: true }));

    for (let m of definition.methods)
      ret.AddCode(1, GeneratorJS.Utils.GenerateCallable(this, m, { isMethod: true, isConstructor: false }));

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

export namespace GeneratorJS.Utils {
  export function GenerateCallable(gen: GeneratorJS, fn: TapeDefinition.Function, settings: { isMethod: Boolean, isConstructor: Boolean }): TapeCode {
    let ret = new TapeCode();
    let args = fn.arguments.map(a => a.name);

    if (settings.isMethod)
      ret.AddString(0, `${fn.name}(${args.join(',')})`);
    else if (settings.isConstructor)
      ret.AddString(0, `constructor(${args.join(',')})`);
    else
      ret.AddString(0, `function ${fn.name}(${args.join(',')})`);

    ret.AddCode(0, fn.content.Generate(gen));
    return ret;
  }
}