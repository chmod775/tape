import TapeCode = require('./TapeCode');
import { TapeGenerator } from './TapeGenerator'

abstract class TapeType {
  private _?: any;
  abstract Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeType {
  export enum _PrimitiveCodes {
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
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Type_Primitive(this);
    }
  }
  
  export class Array extends TapeType {
    public baseType: TapeType;
  
    constructor(baseType: TapeType) {
      super();
      this.baseType = baseType;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Type_Array(this);
    }
  }
}


namespace TapeType.Primitive {
  export const Int8 = new TapeType.Primitive(TapeType._PrimitiveCodes.Int8);
  export const Int16 = new TapeType.Primitive(TapeType._PrimitiveCodes.Int16);
  export const Int32 = new TapeType.Primitive(TapeType._PrimitiveCodes.Int32);
  export const Int64 = new TapeType.Primitive(TapeType._PrimitiveCodes.Int64);
  export const Float = new TapeType.Primitive(TapeType._PrimitiveCodes.Float);
}

export = TapeType;