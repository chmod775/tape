import { TapeExpression } from '../Structure/TapeExpression';
import { TapeInclude } from '../Structure/TapeInclude';
import { TapeGlue } from '../Structure/TapeGlue';

namespace TapeGlue_Math {
  export class Dependecies extends TapeGlue<TapeInclude, Dependecies>() {
    public default(): TapeInclude {
      throw new Error('Method not implemented.');
    }
  }

  export class Sqrt extends TapeGlue<TapeExpression, Sqrt>() {
    public value: TapeExpression;

    constructor(value: TapeExpression) {
      super();
      this.value = value;
    }

    public default(): TapeExpression {
      throw new Error('Method not implemented.');
    }
  }
}

export { TapeGlue_Math as TapeGlue_Math };
