import { TapeGenerator } from '../TapeGenerator'
import { TapeCode } from '../TapeCode'
import { TapeType } from './TapeType'
import { TapeStructure } from '../TapeStructure';
import { TapeScope } from '../TapeScope';
import { TapeDefinition } from './TapeDefinition';

abstract class TapeValue extends TapeStructure {
  Substructure(): TapeStructure[] {
    return [];
  }
}

namespace TapeValue {
  export class Symbol extends TapeValue {
    private name: String;
  
    constructor(name: String) {
      super();
      this.name = name;
    }
  
    Validate(): (String | Boolean)[] {
      return [
        this.scope.Exists(this.name) || `Symbol ${this.name} not defined.`,
      ];
    }

    Generate(generator: TapeGenerator): TapeCode {
      return new TapeCode(this, this.name);
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
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Literal(this);
    }
  }
  
  export class Array extends TapeValue {
    public baseType?: TapeType;
    public values: TapeValue[];
  
    constructor(baseType: TapeType, ...values: TapeValue[]) {
      super();
      this.baseType = baseType;
      this.values = values;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Array(this);
    }
  }
}

export { TapeValue as TapeValue };