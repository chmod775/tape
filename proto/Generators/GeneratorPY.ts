import { TapeGenerator } from '../Core/TapeGenerator';
import { TapeValue } from '../Core/Structure/TapeValue';
import { TapeStatement } from '../Core/Structure/TapeStatement';
import { TapeExpression } from '../Core/Structure/TapeExpression';
import { TapeCode } from '../Core/TapeCode';
import { TapeType } from '../Core/Structure/TapeType';
import { TapeDefinition } from '../Core/Structure/TapeDefinition';
import { TapeTemplate } from '../Core/Structure/TapeTemplate';

export class GeneratorPY extends TapeGenerator {
  Name: String = "PY";

  Type_Primitive(type: TapeType.Primitive): TapeCode {
    throw new Error('Method not implemented.');
  }
  Type_List(type: TapeType.List): TapeCode {
    throw new Error('Method not implemented.');
  }
  Type_Class(type: TapeType.Class): TapeCode {
    throw new Error('Method not implemented.');
  }

  This(part: TapeValue.This): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, `this`);
    return ret;
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
    let isBoolean = (typeof value.value === 'boolean' || value.value instanceof Boolean);
    if (isString)
      ret.AddContent(0, `"${value.value}"`)
    else if (isBoolean)
      ret.AddContent(0, value.value ? 'True' : 'False');
    else
      ret.AddContent(0, value.value.toString());
    return ret;
  }
  List(value: TapeValue.List): TapeCode {
    let ret = new TapeCode(value);
    ret.AddContent(0, '[$,0]', value.values.map(v => v.$Generate(this)));
    return ret;
  }

  Block(statement: TapeStatement.Block): TapeCode {
    let ret = new TapeCode(statement);
    for (let i of statement.items) {
      let iRet = i.$Generate(this);
      ret.AddCode(1, iRet);
    }
    return ret;
  }
  If(statement: TapeStatement.If): TapeCode {
    let ret = new TapeCode(statement);
    
    ret.AddContent(0, 'if ($0):', statement.condition.$Generate(this));
    ret.AddCode(0, statement.ifTrue.$Generate(this));

    if (statement.ifFalse) {
      ret.AddContent(0, 'else:');
      ret.AddCode(0, statement.ifFalse.$Generate(this));
    }

    return ret;
  }
  For(statement: TapeStatement.For): TapeCode {
    let ret = new TapeCode(statement);
    
    ret.AddContent(0, '$0', statement.init.$Generate(this));
    ret.AddContent(0, 'while ($0):', statement.condition.$Generate(this));
    ret.AddCode(0, statement.loop.$Generate(this));
    ret.AddContent(1, '$0', statement.increment.$Generate(this));

    return ret;
  }
  For_Break(statement: TapeStatement.For.Break): TapeCode {
    let ret = new TapeCode(statement);
    ret.AddContent(0, 'break');
    return ret;
  }
  Return(part: TapeStatement.Return): TapeCode {
    let ret = new TapeCode(part);
    ret.AddContent(0, 'return $0', part.expression.$Generate(this));
    return ret;
  }

  FunctionArgument(definition: TapeDefinition.Function.Argument): TapeCode {
    let ret = new TapeCode(definition);
    ret.AddContent(0, `${definition.name}`);
    return ret;
  }
  Variable(definition: TapeDefinition.Variable): TapeCode {
    let ret = new TapeCode(definition);
    if (definition.init)
      ret.AddContent(0, `${definition.name} = $0`, definition.init.$Generate(this));
    return ret;
  }
  Function(definition: TapeDefinition.Function): TapeCode {
    return GeneratorPY.Utils.GenerateCallable(this, definition, { isMethod: false, isConstructor: false });
  }
  Class(definition: TapeDefinition.Class): TapeCode {
    let ret = new TapeCode(definition);

    ret.AddContent(0, `class ${definition.name} {`);

    // Fields
    for (let f of definition.fields)
      ret.AddContent(1, '', f.$Generate(this));

    let initializedFields = definition.fields.filter(f => f.init);
    if (initializedFields.length > 0) {
      // Create __init method to be called in every constructor
      let initFnContent: TapeExpression[] = [];
      for (let f of initializedFields) {
        initFnContent.push(TapeExpression.Assignment((new TapeValue.This()).Access(`${f.name}`), f.init))
      }

      let initFn = new TapeDefinition.Function('__init').Content(initFnContent);
      ret.AddCode(1, GeneratorPY.Utils.GenerateCallable(this, initFn, { isMethod: true, isConstructor: false }));

      if (definition.constructors.length == 0) { // If no constructors defined, define a default one with no arguments
        let initConstructorContent: TapeExpression[] = [
          TapeExpression.Invoke((new TapeValue.This()).Access(`__init`), [])
        ];
        let initConstructor = new TapeDefinition.Method('').Content(initConstructorContent);
        ret.AddCode(1, GeneratorPY.Utils.GenerateCallable(this, initConstructor, { isMethod: false, isConstructor: true }));
      }
    }

    // Constructors
    for (let c of definition.constructors)
      ret.AddCode(1, GeneratorPY.Utils.GenerateCallable(this, c, { isMethod: false, isConstructor: true }));

    // Methods
    for (let m of definition.methods)
      ret.AddCode(1, GeneratorPY.Utils.GenerateCallable(this, m, { isMethod: true, isConstructor: false }));

    ret.AddContent(0, '}');

    return ret;
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
    let ret = new TapeCode(part);
    ret.AddContent(0, `new $0($,1)`, part.target.$Generate(this), part.args.map(v => v.$Generate(this)));
    return ret;
  }
}

export namespace GeneratorPY.Utils {
  export function GenerateCallable(gen: GeneratorPY, fn: TapeDefinition.Function, settings: { isMethod: Boolean, isConstructor: Boolean }): TapeCode {
    let ret = new TapeCode(fn);

    if (settings.isMethod)
      ret.AddContent(0, `${fn.name}($,0)`, fn.arguments.map(a => a.$Generate(gen)));
    else if (settings.isConstructor)
      ret.AddContent(0, `constructor($,0)`, fn.arguments.map(a => a.$Generate(gen)));
    else
      ret.AddContent(0, `def ${fn.name}($,0):`, fn.arguments.map(a => a.$Generate(gen)));

    ret.AddCode(0, fn.content.$Generate(gen));
    return ret;
  }
}