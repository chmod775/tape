import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../Tape'
import { TapeTemplate } from "../Structure/TapeTemplate";
import { TapeStatement } from '../Structure/TapeStatement';

class TapeTemplate_Console extends TapeTemplate<TapeExpression> {
  constructor(expr: TapeExpression) {
    super();

    this.generators['JS'] = Tape.Function.Invoke(Tape.Value.Symbol('console').Access('log'), [ expr ]);
    this.generators['CS'] = Tape.Function.Invoke(Tape.Value.Symbol('Console').Access('Write'), [ expr ]);
    this.generators['PY'] = Tape.Function.Invoke(Tape.Value.Symbol('print'), [ expr ]);
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
