import { TapeGenerator } from './TapeGenerator';
import TapeType = require('./TapeType');
import TapeValue = require('./TapeValue');
import TapeCode = require('./TapeCode');
import TapeStatement = require('./TapeStatement');

abstract class TapeDefinition {
  abstract Generate(generator: TapeGenerator) : TapeCode;
}

namespace TapeDefinition {
  export class Variable extends TapeDefinition {
    public name: String;
    public type: TapeType;
    public init?: TapeValue;
  
    constructor(name: String, type: TapeType) {
      super();
  
      this.name = name;
      this.type = type;
    }
  
    Initialize(value: TapeValue) : Variable {
      this.init = value;
      return this;
    }
  
    Generate(generator: TapeGenerator): TapeCode {
      return generator.Variable(this);
    }
  }

  export class Function extends TapeDefinition {
    public name: String;
    public returnType?: TapeType;
    public arguments: Function.Argument[] = [];
    public content?: TapeStatement.Block;

    constructor(name: String, returnType?: TapeType, args?: Function.Argument[]) {
      super();
      this.name = name;
      this.returnType = returnType;
      this.arguments = args ?? [];
    }

    Arguments(...args: Function.Argument[]): Function {
      this.arguments.push(...args);
      return this;
    }

    Content(items: TapeStatement[] | TapeDefinition[]): Function {
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
}

export = TapeDefinition;