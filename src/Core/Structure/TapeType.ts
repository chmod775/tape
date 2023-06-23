import { TapeGenerator } from '../TapeGenerator'
import { TapeCode } from '../TapeCode'
import { TapeStructure } from '../TapeStructure';
import { TapeScope } from '../TapeScope';
import { TapeValue } from './TapeValue';

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
    public symbol: TapeValue.Symbol;

    constructor(symbol: TapeValue.Symbol) {
      super();
      this.symbol = symbol;
    }
  
    $Generate(generator: TapeGenerator): TapeCode {
      return generator.Type_Class(this);
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