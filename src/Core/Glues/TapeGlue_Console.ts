import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../../Tape'
import { TapeGlue } from '../Structure/TapeGlue';

class TapeGlue_Console extends TapeGlue<TapeExpression, TapeGlue_Console>() {
  public expression: TapeExpression;

  constructor(expr: TapeExpression) {
    super();
    this.expression = expr;
  }

  public default(): TapeExpression {
    throw new Error('Method not implemented.');
  }
}

export { TapeGlue_Console as TapeGlue_Console };
