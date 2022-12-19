import { TapeGenerator } from '../TapeGenerator';
import { TapeValue } from './TapeValue';
import { TapeStatement } from './TapeStatement';
import { TapeExpression } from './TapeExpression';
import { TapeCode } from '../TapeCode';
import { TapeType } from './TapeType';
import { TapeScope } from '../TapeScope';
import { TapeStructure } from '../TapeStructure';

abstract class TapeDefinition extends TapeStructure {
  public name: String;
  
  constructor(name: String) {
    super();
    this.name = name;
  }

  abstract Generate(generator: TapeGenerator) : TapeCode;

  Substructure(): TapeStructure[] {
    return [];
  }
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

    Create(parentScope: TapeScope): (Boolean | String)[] {
      let errors: (Boolean | String)[] = [
        !parentScope.Exists(this.name) || `Variable name ${this.name} already defined.`,
      ];

      parentScope.Add(this);
      this.scope = parentScope;

      return errors;
    }
  }

  export class Function extends TapeDefinition {
    public returnType?: TapeType;
    public arguments: Function.Argument[] = [];
    public content?: TapeStatement.Block;

    Substructure(): TapeStructure[] {
      return [
        this.returnType,
        ...this.arguments,
        this.content
      ];
    }

    constructor(name: String, returnType?: TapeType, args?: Function.Argument[]) {
      super(name);
      this.returnType = returnType;
      this.arguments = args ?? [];
    }

    Arguments(...args: Function.Argument[]): Function {
      this.arguments.push(...args);
      return this;
    }

    Content(items: (TapeExpression | TapeStatement | TapeDefinition)[]): Function {
      this.content = new TapeStatement.Block(items);
      return this;
    }

    Create(parentScope: TapeScope): (Boolean | String)[] {
      let errors: (Boolean | String)[] = [
        !parentScope.Exists(this.name) || `Function name ${this.name} already defined.`,
      ];

      parentScope.Add(this);

      let defs = this.arguments.filter(t => t instanceof TapeDefinition) as TapeDefinition[];
      this.scope = new TapeScope(parentScope, defs);

      return errors;
    }

    Generate(generator: TapeGenerator): TapeCode {
      return generator.Function(this);
    }
  }
  export namespace Function {
    export class Argument extends TapeDefinition {
      public type: TapeType;

      constructor(name: String, type: TapeType) {
        super(name);
        this.type = type;
      }

      Generate(generator: TapeGenerator): TapeCode {
        throw new Error('Method not implemented.');
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