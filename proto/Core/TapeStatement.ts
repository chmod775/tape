import * as Tape from './Tape'
import * as TapeDefinition from './TapeDefinition'
import * as TapeExpression from './TapeExpression'
import { TapeGenerator } from './TapeGenerator'

export abstract class Base {
  abstract Generate(generator: TapeGenerator) : Tape.Code;
}

export class Block extends Base {
  public defs: Base[] | TapeDefinition.Base[];

  constructor(defs: Base[] | TapeDefinition.Base[]) {
    super();
    this.defs = defs;
  }

  Generate(generator: Tape.Generator): Tape.Code {
    return generator.Block(this);
  }
}

export class If extends Base {
  public condition: TapeExpression.Base;
  public def: TapeDefinition.Base;
  public elseDef?: TapeDefinition.Base = undefined;

  constructor(condition: TapeExpression.Base, def: TapeDefinition.Base) {
    super();

    this.condition = condition;
    this.def = def;
  }

  Else(elseDef: TapeDefinition.Base) : If {
    this.elseDef = elseDef;
    return this;
  }

  Generate(generator: Tape.Generator): Tape.Code {
    return generator.If(this);
  }
}