import * as Tape from './Tape'
import TapeValue = require('./TapeValue');

class TapeExpression {
}

namespace TapeExpression {
  export function Parse(expression: String) : TapeExpression {
    return new TapeExpression();
  }
  
  export function Assignment(target: TapeValue.Symbol, value: TapeValue) : TapeExpression {
    return new TapeExpression();
  }
}

export = TapeExpression;