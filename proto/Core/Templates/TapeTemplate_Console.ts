import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../Tape'
import { TapeTemplate } from "../Structure/TapeTemplate";

class TapeTemplate_Console extends TapeTemplate {
  constructor(expr: TapeExpression) {
    super();

    this.generators['JS'] = Tape.Block([
      Tape.Function.Invoke(Tape.Value.Symbol('console').Access('log'), [ expr ])
    ]);
  }
}
/*
declare namespace Complimentary {
  export function Console() {
    
  }
}

export const FC: (typeof Complimentary & typeof TapeTemplate) = TapeTemplate as any;
*/
export { TapeTemplate_Console as TapeTemplate_Console };
