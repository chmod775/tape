import { TapeGenerator } from '../TapeGenerator';
import { TapeValue } from './TapeValue';
import { TapeStatement } from './TapeStatement';
import { TapeExpression } from './TapeExpression';
import { TapeCode } from '../TapeCode';
import { TapeType } from './TapeType';
import { TapeScope } from '../TapeScope';
import { TapeStructure } from '../TapeStructure';
import { TapeAccess } from '../Interfaces/TapeAccess';

abstract class TapeDefinition extends TapeStructure {
  public name: String;
  
  constructor(name: String) {
    super();
    this.name = name;
  }

  abstract $Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeDefinition {
  export class Variable extends TapeDefinition {
    public type: TapeType;
    public init?: TapeExpression;
  
    constructor(name: String, type: TapeType) {
      super(name);
      this.type = type;
    }
  
    InitializeWithValue<T extends this>(value: TapeValue.Literal | TapeValue.List) : T {
      value.baseType = this.type;
      this.init = new TapeExpression(new TapeExpression.Part.Value(value));
      return this as T;
    }
  
    InitializeWithExpression<T extends this>(value: TapeExpression) : T {
      this.init = value;
      return this as T;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Variable(this);
    }

    $Create(parentScope: TapeScope): (Boolean | String)[] {
      let errors: (Boolean | String)[] = [
        !parentScope.Exists(this.name) || `Variable name ${this.name} already defined.`,
      ];

      parentScope.Add(this);
      
      this.type.$Create(parentScope);
      this.scope = this.type.scope;

      return errors;
    }
  }

  export class CustomType extends TapeDefinition {
    public items: CustomType.Item[];

    constructor(name: String, items: CustomType.Item[]) {
      super(name);
      this.items = items;
    }

    $Create(parentScope: TapeScope): (Boolean | String)[] {
      let errors: (Boolean | String)[] = [
        !parentScope.Exists(this.name) || `CustomType name ${this.name} already defined.`,
      ];

      parentScope.Add(this);

      this.scope = new TapeScope(this);

      return errors;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.CustomType(this);
    }
  }
  export namespace CustomType {
    export class Item extends Variable {
      public owner: CustomType;
  
      $Generate(generator: TapeGenerator): TapeCode {
        return generator.CustomType_Item(this);
      }
    }
  }

  export class Function extends TapeDefinition {
    public returnType: TapeType;
    public arguments: Function.Argument[] = [];

    public _content?: TapeStatement.Block;
    public get content(): TapeStatement.Block {
      if (!this._content) throw `Cannot access null content`;
      return this._content;
    }

    constructor(name: String, returnType: TapeType = TapeType.Primitive.Void, args?: Function.Argument[]) {
      super(name);
      this.returnType = returnType;
      this.arguments = args ?? [];
    }

    Arguments<T extends this>(...args: Function.Argument[]): T {
      this.arguments.push(...args);
      return this as T;
    }

    Content<T extends this>(items: (TapeExpression | TapeStatement | TapeDefinition)[]): T {
      this._content = new TapeStatement.Block(items);
      return this as T;
    }

    $Create(parentScope: TapeScope): (Boolean | String)[] {
      let errors: (Boolean | String)[] = [
        !parentScope.Exists(this.name) || `Function name ${this.name} already defined.`,
      ];

      parentScope.Add(this);

      let defs = this.arguments.filter(t => t instanceof TapeDefinition) as TapeDefinition[];
      this.scope = new TapeScope(this, parentScope, defs);

      return errors;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Function(this);
    }
  }
  export namespace Function {
    export class Argument extends TapeDefinition {
      public type: TapeType;
      public IsReadWrite: boolean = false;

      constructor(name: String, type: TapeType) {
        super(name);
        this.type = type;
      }

      public AsReadWrite(): Function.Argument {
        this.IsReadWrite = true;
        return this;
      }
      
      $Create(parentScope: TapeScope): (Boolean | String)[] {
        this.type.$Create(parentScope);
        this.scope = this.type.scope;
        return this.$Validate();
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.FunctionArgument(this);
      }
    }
  }

  export class Class extends TapeDefinition implements TapeAccess {
    public parent?: Class;
    public fields: Class.Field[] = [];
    public constructors: Class.Method[] = [];
    public methods: Class.Method[] = [];

    constructor(name: String, parent?: Class) {
      super(name);
      this.parent = parent;
    }

    Access(name: String): TapeDefinition {
      let foundField = this.fields.filter(t => t.name == name)[0];
      let foundMethod = this.methods.filter(t => t.name == name)[0];
      return foundField ?? foundMethod;
    }

    $Create(parentScope: TapeScope): (Boolean | String)[] {
      let errors: (Boolean | String)[] = [
        !parentScope.Exists(this.name) || `Class name ${this.name} already defined.`,
      ];

      parentScope.Add(this);

      this.scope = new TapeScope(this, parentScope);

      return errors;
    }

    Constructors(constructors: Class.Method[]): Class {
      this.constructors = constructors;
      return this;
    }

    Fields(fields: Class.Field[]): Class {
      this.fields = fields;
      return this;
    }

    Methods(methods: Class.Method[]): Class {
      this.methods = methods;
      return this;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Class(this);
    }
  }
  export namespace Class {
    export class Method extends Function {
      public owner: Class;
  
      $Create(parentScope: TapeScope): (Boolean | String)[] {
        let errors: (Boolean | String)[] = [
          !parentScope.ExistsLocal(this.name) || `Method name ${this.name} already defined.`,
        ];
  
        parentScope.Add(this);
  
        let defs = this.arguments.filter(t => t instanceof TapeDefinition) as TapeDefinition[];
        this.scope = new TapeScope(this, parentScope, defs);
  
        return errors;
      }
  
      $Generate(generator: TapeGenerator): TapeCode {
        return generator.Method(this);
      }
    }
  
    export class Field extends Variable {
      public owner: Class;
  
      $Create(parentScope: TapeScope): (Boolean | String)[] {
        let errors: (Boolean | String)[] = [
          !parentScope.ExistsLocal(this.name) || `Field name ${this.name} already defined.`,
        ];
  
        parentScope.Add(this);
        this.scope = parentScope;
  
        return errors;
      }
  
      $Generate(generator: TapeGenerator): TapeCode {
        return generator.Field(this);
      }
    }
  }
}

export { TapeDefinition as TapeDefinition };