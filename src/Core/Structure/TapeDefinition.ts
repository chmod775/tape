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
  private _name: String;
  public get name(): String {
    return this._name;
  }

  constructor(name: String) {
    super();
    this._name = name;
  }

  abstract $Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeDefinition {
  export class Variable extends TapeDefinition {
    private _type: TapeType;
    public get type(): TapeType {
      return this._type;
    }

    private _init?: TapeExpression;
    public get init(): TapeExpression | undefined {
      return this._init;
    }

    constructor(name: String, type: TapeType) {
      super(name);
      this._type = type;
    }
  
    InitializeWithValue<T extends this>(value: TapeValue.Literal | TapeValue.List) : T {
      value.baseType = this._type;
      this._init = new TapeExpression(new TapeExpression.Part.Value(value));
      return this as T;
    }
  
    InitializeWithExpression<T extends this>(value: TapeExpression) : T {
      this._init = value;
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
      
      this._type.$Create(parentScope);
      this.scope = this._type.scope;

      return errors;
    }
  }

  export class CustomType extends TapeDefinition {
    private _items: CustomType.Item[];
    public get items(): ReadonlyArray<CustomType.Item> {
      return this._items;
    }

    constructor(name: String, items: CustomType.Item[]) {
      super(name);
      this._items = items;
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
      private _owner?: CustomType;
      public get owner(): CustomType {
        return this.owner;
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.CustomType_Item(this);
      }
    }
  }

  export class Function extends TapeDefinition {
    private _returnType: TapeType;
    public get returnType(): TapeType {
      return this._returnType;
    }

    private _arguments: Function.Argument[] = [];
    public get arguments(): ReadonlyArray<Function.Argument> {
      return this._arguments;
    }

    private _content?: TapeStatement.Block;
    public get content(): TapeStatement.Block {
      if (!this._content) throw `Cannot access null content`;
      return this._content;
    }

    constructor(name: String, returnType: TapeType = TapeType.Primitive.Void, args?: Function.Argument[]) {
      super(name);
      this._returnType = returnType;
      this._arguments = args ?? [];
    }

    Arguments<T extends this>(...args: Function.Argument[]): T {
      this._arguments.push(...args);
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

      let defs = this._arguments.filter(t => t instanceof TapeDefinition) as TapeDefinition[];
      this.scope = new TapeScope(this, parentScope, defs);

      return errors;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Function(this);
    }
  }
  export namespace Function {
    export class Argument extends TapeDefinition {
      private _type: TapeType;
      public get type(): TapeType {
        return this._type;
      }

      private _IsReadWrite: boolean = false;
      public get IsReadWrite(): boolean {
        return this._IsReadWrite;
      }

      constructor(name: String, type: TapeType) {
        super(name);
        this._type = type;
      }

      public AsReadWrite(): Function.Argument {
        this._IsReadWrite = true;
        return this;
      }
      
      $Create(parentScope: TapeScope): (Boolean | String)[] {
        this._type.$Create(parentScope);
        this.scope = this._type.scope;
        return this.$Validate();
      }

      $Generate(generator: TapeGenerator): TapeCode {
        return generator.FunctionArgument(this);
      }
    }
  }

  export class Class extends TapeDefinition implements TapeAccess {
    private _parent?: Class;
    public get parent(): Class | undefined {
      return this._parent;
    }

    private _fields: Class.Field[] = [];
    public get fields(): ReadonlyArray<Class.Field> {
      return this._fields;
    }

    private _constructors: Class.Method[] = [];
    public get constructors(): ReadonlyArray<Class.Method> {
      return this._constructors;
    }

    private _methods: Class.Method[] = [];
    public get methods(): ReadonlyArray<Class.Method> {
      return this._methods;
    }

    constructor(name: String, parent?: Class) {
      super(name);
      this._parent = parent;
    }

    Access(name: String): TapeDefinition {
      let foundField = this._fields.filter(t => t.name == name)[0];
      let foundMethod = this._methods.filter(t => t.name == name)[0];
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
      this._constructors = constructors;
      return this;
    }

    Fields(fields: Class.Field[]): Class {
      this._fields = fields;
      return this;
    }

    Methods(methods: Class.Method[]): Class {
      this._methods = methods;
      return this;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Class(this);
    }
  }
  export namespace Class {
    export class Method extends Function {
      private _owner?: Class;
      public get owner(): Class | undefined {
        return this._owner;
      }

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
      private _owner?: Class;
      public get owner(): Class | undefined {
        return this._owner;
      }

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