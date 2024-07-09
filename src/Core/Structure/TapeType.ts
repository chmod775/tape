import { TapeGenerator } from '../TapeGenerator'
import { TapeCode } from '../TapeCode'
import { TapeStructure } from '../TapeStructure';
import { TapeScope } from '../TapeScope';
import { TapeValue } from './TapeValue';
import { TapeDefinition } from './TapeDefinition';

abstract class TapeType extends TapeStructure {
}

namespace TapeType {
  export enum _PrimitiveCodes {
    Void,
    Bool,
    Int8,
    Int16,
    Int32,
    Int64,
    UInt8,
    UInt16,
    UInt32,
    UInt64,
    Float,
    Double,
    String
  }
  
  export class Primitive extends TapeType {
    public code: _PrimitiveCodes;
  
    constructor(code: _PrimitiveCodes) {
      super();
      this.code = code;
    }
  
    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Type_Primitive(this);
    }
  }
  
  export class List extends TapeType {
    public baseType: TapeType;
  
    constructor(baseType: TapeType) {
      super();
      this.baseType = baseType;
    }
  
    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Type_List(this);
    }
  }

  export class Class extends TapeType {
    public def: TapeDefinition.Class;

    constructor(def: TapeDefinition.Class) {
      super();
      this.def = def;
    }
  
    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Type_Class(this);
    }
  }

  export class Custom extends TapeType {
    public def: TapeDefinition.CustomType;

    constructor(def: TapeDefinition.CustomType) {
      super();
      this.def = def;
    }
  
    $Create(parentScope: TapeScope): (Boolean | String)[] {
      this.scope = this.def.scope;
      return this.$Validate();
    }

    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Type_Custom(this);
    }
  }
}

namespace TapeType.Primitive {
  export const Void = new TapeType.Primitive(TapeType._PrimitiveCodes.Void);
  export const Bool = new TapeType.Primitive(TapeType._PrimitiveCodes.Bool);
  export const Int8 = new TapeType.Primitive(TapeType._PrimitiveCodes.Int8);
  export const Int16 = new TapeType.Primitive(TapeType._PrimitiveCodes.Int16);
  export const Int32 = new TapeType.Primitive(TapeType._PrimitiveCodes.Int32);
  export const Int64 = new TapeType.Primitive(TapeType._PrimitiveCodes.Int64);
  export const UInt8 = new TapeType.Primitive(TapeType._PrimitiveCodes.UInt8);
  export const UInt16 = new TapeType.Primitive(TapeType._PrimitiveCodes.UInt16);
  export const UInt32 = new TapeType.Primitive(TapeType._PrimitiveCodes.UInt32);
  export const UInt64 = new TapeType.Primitive(TapeType._PrimitiveCodes.UInt64);
  export const Float = new TapeType.Primitive(TapeType._PrimitiveCodes.Float);
  export const Double = new TapeType.Primitive(TapeType._PrimitiveCodes.Double);
  export const String = new TapeType.Primitive(TapeType._PrimitiveCodes.String);
}

export { TapeType as TapeType };