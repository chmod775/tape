import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../Tape'
import { TapeTemplate } from "../Structure/TapeTemplate";
import { TapeValue } from '../Structure/TapeValue';

namespace TapeTemplate_Math {
  export class Sqrt extends TapeTemplate<TapeExpression> {
    public value: TapeExpression;

    constructor(value: TapeExpression) {
      super();
  
      this.value = value;

      this.generators['JS'] = Tape.Function.Invoke(Tape.Value.Symbol('Math').Access('sqrt'), [ value ]);
    }
  }
}

export { TapeTemplate_Math as TapeTemplate_Math };
