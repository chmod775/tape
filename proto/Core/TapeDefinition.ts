import { TapeGenerator } from './TapeGenerator';
import { TapeValue } from './TapeValue';
import { TapeStatement } from './TapeStatement';
import { TapeExpression } from './TapeExpression';
import { TapeCode } from './TapeCode';
import { TapeType } from './TapeType';

abstract class TapeDefinition {
  public name: String;
  
  constructor(name: String) {
    this.name = name;
  }

  abstract Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeDefinition {
  export class Variable extends TapeDefinition {
    public type: TapeType;
    public init?: TapeExpression;
  
    constructor(name: String, type: TapeType) {
      super(name);
      this.type = type;
    }
  
    InitializeWithValue(value: TapeValue.Literal | TapeValue.Array) : Variable {
      value.baseType = this.type;
      this.init = new TapeExpression(new TapeExpression.Part.Value(value));
      return this;
    }
  
    InitializeWithExpression(value: TapeExpression) : Variable {
      this.init = value;
      return this;
    }

    Generate(generator: TapeGenerator): TapeCode {
      return generator.Variable(this);
    }
  }

  export class Function extends TapeDefinition {
    public returnType?: TapeType;
    public arguments: Function.Argument[] = [];
    public content?: TapeStatement.Block;

    constructor(name: String, returnType?: TapeType, args?: Function.Argument[]) {
      super(name);
      this.returnType = returnType;
      this.arguments = args ?? [];
    }

    Arguments(...args: Function.Argument[]): Function {
      this.arguments.push(...args);
      return this;
    }

    Content(items: TapeExpression[] | TapeStatement[] | TapeDefinition[]): Function {
      this.content = new TapeStatement.Block(items);
      return this;
    }

    Generate(generator: TapeGenerator): TapeCode {
      return generator.Function(this);
    }
  }
  export namespace Function {
    export class Argument {
      public name: String;
      public type: TapeType;

      constructor(name: String, type: TapeType) {
        this.name = name;
        this.type = type;
      }
    }
  }

  export class Method extends Function {

  }

  export class Field extends Variable {
  }

  export class Class extends TapeDefinition {
    public parent?: Class;
    public fields: Field[] = [];
    public constructors: Method[] = [];
    public methods: Method[] = [];

    constructor(name: String, parent?: Class) {
      super(name);
      this.parent = parent;
    }

    Constructors(constructors: Method[]): Class {
      this.constructors = constructors;
      return this;
    }

    Fields(fields: Field[]): Class {
      this.fields = fields;
      return this;
    }

    Methods(methods: Method[]): Class {
      this.methods = methods;
      return this;
    }

    Generate(generator: TapeGenerator): TapeCode {
      return generator.Class(this);
    }

  }
}

export { TapeDefinition as TapeDefinition };