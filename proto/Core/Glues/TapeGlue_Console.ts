import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../Tape'
import { TapeGlue } from '../Structure/TapeGlue';

class TapeGlue_Console extends TapeGlue<TapeExpression> {
  constructor(expr: TapeExpression) {
    super();

    this.macro['JS'] = Tape.Function.Invoke(Tape.Value.Symbol('console').Access('log'), [ expr ]);
    this.macro['CS'] = Tape.Function.Invoke(Tape.Value.Symbol('Console').Access('Write'), [ expr ]);
    this.macro['PY'] = Tape.Function.Invoke(Tape.Value.Symbol('print'), [ expr ]);
  }

  public default(): TapeExpression {
    throw new Error('Method not implemented.');
  }
}

export { TapeGlue_Console as TapeGlue_Console };
