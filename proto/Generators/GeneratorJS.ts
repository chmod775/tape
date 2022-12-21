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
      return new TapeCode(value, `"${value.value}"`);
    else
      return new TapeCode(value, value.value.toString());
  }
  Array(value: TapeValue.Array): TapeCode {
    let line = '[';

    let items: String[] = [];
    for (var i of value.values)
      items.push(i.Generate(this).Content());
    line += items.join(',');

    line += ']';
    return new TapeCode(value, line);
  }

  Block(statement: TapeStatement.Block): TapeCode {
    let ret = new TapeCode(statement);

    ret.AddContent(0, '{');

    for (let i of statement.items) {
      let iRet = i.Generate(this);

      ret.AddCode(1, iRet);
    }

    ret.AddContent(0, '}');

    return ret;
  }
  If(statement: TapeStatement.If): TapeCode {
    let ret = new TapeCode(statement);
    
    ret.AddContent(0, 'if ($0)', statement.condition.Generate(this));
    ret.AddCode(0, statement.ifTrue.Generate(this));

    if (statement.ifFalse) {
      ret.AddContent(0, 'else');
      ret.AddCode(0, statement.ifFalse.Generate(this));
    }

    return ret;
  }
  Return(part: TapeStatement.Return): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, 'return $0;', part.expression.Generate(this));
    return ret;
  }

  Variable(definition: TapeDefinition.Variable): TapeCode {
    let ret = new TapeCode(definition);
    if (definition.init)
      ret.AddContent(0, 'var ${definition.name} = $0;', definition.init.Generate(this));
    else
      ret.AddContent(0, 'var ${definition.name};');
    return ret;
  }
  Function(definition: TapeDefinition.Function): TapeCode {
    return GeneratorJS.Utils.GenerateCallable(this, definition, { isMethod: false, isConstructor: false });
  }
  Class(definition: TapeDefinition.Class): TapeCode {
    let ret = new TapeCode(definition);

    ret.AddContent(0, `class ${definition.name} {`);

    for (let f of definition.fields)
      ret.AddContent(1, '', f.Generate(this));

    let initializedFields = definition.fields.filter(f => f.init);
    if (initializedFields.length > 0) {
      // Create __init method to call every constructor
      let initFnContent: TapeExpression[] = [];
      for (let f of initializedFields) {
        initFnContent.push(TapeExpression.Assignment(new TapeValue.Symbol(`${f.name}`), f.init))
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

    ret.AddContent(0, '}');

    return ret;
  }


  ExpressionPart_Value(part: TapeExpression.Part.Value): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0`, part.value.Generate(this));
    return ret;
  }
  ExpressionPart_Assign(part: TapeExpression.Part.Assign): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, '$0 = $1', part.target.Generate(this), part.value.Generate(this));
    return ret;
  }
  ExpressionPart_Binary(part: TapeExpression.Part.Binary): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0 ${part.operator} $1`, part.left.Generate(this), part.right.Generate(this));
    return ret;
  }
  ExpressionPart_Relational(part: TapeExpression.Part.Relational): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `$0 ${part.operator} $1`, part.left.Generate(this), part.right.Generate(this));
    return ret;
  }
}

export namespace GeneratorJS.Utils {
  export function GenerateCallable(gen: GeneratorJS, fn: TapeDefinition.Function, settings: { isMethod: Boolean, isConstructor: Boolean }): TapeCode {
    let ret = new TapeCode(fn);
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