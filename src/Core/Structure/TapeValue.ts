import { TapeGenerator } from '../TapeGenerator'
import { TapeCode } from '../TapeCode'
import { TapeType } from './TapeType'
import { TapeStructure } from '../TapeStructure';
import { TapeScope } from '../TapeScope';
import { TapeDefinition } from './TapeDefinition';
import { TapeAccess } from '../Interfaces/TapeAccess';

abstract class TapeValue extends TapeStructure {
}

namespace TapeValue {
  export class This extends TapeValue {
    private def?: TapeDefinition.Class;

    constructor() {
      super();
    }

    $Create(parentScope: TapeScope): (Boolean | String)[] {
      let errors: (Boolean | String)[] = [
      ];
  
      this.scope = parentScope.GetBackward(TapeDefinition.Class);
      this.def = this.scope.owner as TapeDefinition.Class;

      return errors;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.This(this);
    }

    Access(name: String): Symbol {
      return new Symbol(name, this);
    }
  }

  export class Symbol extends TapeValue {
    private _def?: TapeAccess;
    public get def(): TapeAccess | undefined {
      return this._def;
    }

    private _source?: This | Symbol;
    public get source(): (This | Symbol) | undefined {
      return this._source;
    }

    private _name: String;
    public get name(): String {
      return this._name;
    }
  
    constructor(name: String, source?: This | Symbol) {
      super();
      this._name = name;
      this._source = source;
    }

    $Create(parentScope: TapeScope): (Boolean | String)[] {
      if (this.scope) return [];
      
      if (this._source) {
        this._source.$Create(parentScope);
        parentScope = this._source.scope;
      }

      let errors: (Boolean | String)[] = [
        parentScope.Exists(this._name) || `Symbol ${this._name} not defined.`,
      ];

      console.log(parentScope);

      var oSource = parentScope.Find(this._name);
      this.scope = oSource.scope;

      return errors;
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Symbol(this);
    }

    Access(name: String): Symbol {
      return new Symbol(name, this);
    }
  }
  
  export class Literal extends TapeValue {
    private _baseType?: TapeType;
    public get baseType(): TapeType | undefined {
      return this._baseType;
    }

    private _value: any;
    public get value(): any {
      return this._value;
    }
  
    constructor(baseType: TapeType, value: any) {
      super();
      this._baseType = baseType;
      this._value = value;
    }
  
    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Literal(this);
    }
  }
  
  export class List extends TapeValue {
    private _baseType?: TapeType.List;
    public get baseType(): TapeType.List | undefined {
      return this._baseType;
    }

    private _values: TapeValue[];
    public get values(): ReadonlyArray<TapeValue> {
      return this._values;
    }
  
    constructor(baseType: TapeType, ...values: TapeValue[]) {
      super();
      this._baseType = new TapeType.List(baseType);
      this._values = values;
    }
  
    $Generate(generator: TapeGenerator): TapeCode {
      return generator.List(this);
    }
  }
}

export { TapeValue as TapeValue };