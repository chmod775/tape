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
    public def?: TapeAccess;

    public source?: This | Symbol;
    public name: String;
  
    constructor(name: String, source?: This | Symbol) {
      super();
      this.name = name;
      this.source = source;
    }

    $Create(parentScope: TapeScope): (Boolean | String)[] {
      if (this.scope) return [];
      
      if (this.source) {
        this.source.$Create(parentScope);
        parentScope = this.source.scope;
      }

      let errors: (Boolean | String)[] = [
        parentScope.Exists(this.name) || `Symbol ${this.name} not defined.`,
      ];

      var oSource = parentScope.Find(this.name);
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
    public baseType?: TapeType;
    public value: any;
  
    constructor(baseType: TapeType, value: any) {
      super();
      this.baseType = baseType;
      this.value = value;
    }
  
    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Literal(this);
    }
  }
  
  export class List extends TapeValue {
    public baseType?: TapeType.List;
    public values: TapeValue[];
  
    constructor(baseType: TapeType, ...values: TapeValue[]) {
      super();
      this.baseType = new TapeType.List(baseType);
      this.values = values;
    }
  
    $Generate(generator: TapeGenerator): TapeCode {
      return generator.List(this);
    }
  }
}

export { TapeValue as TapeValue };