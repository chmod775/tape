import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../Tape'
import { TapeValue } from '../Structure/TapeValue';
import { TapeInclude } from '../Structure/TapeInclude';
import { TapeGlue } from '../Structure/TapeGlue';

class DependeciesTemplate extends TapeGlue<TapeInclude> {
  constructor() {
    super();

    this.macro['JS'] = null;
    this.macro['CS'] = null;
    this.macro['PY'] = Tape.Include('math');
  }

  public default(): TapeInclude {
    throw new Error('Method not implemented.');
  }
}

namespace TapeGlue_Math {
  export function Dependecies(): DependeciesTemplate {
    return new DependeciesTemplate();
  }

  export class Sqrt extends TapeGlue<TapeExpression> {
    public value: TapeExpression;

    constructor(value: TapeExpression) {
      super();
  
      this.value = value;

      this.macro['JS'] = Tape.Function.Invoke(Tape.Value.Symbol('Math').Access('sqrt'), [ value ]);
      this.macro['CS'] = Tape.Function.Invoke(Tape.Value.Symbol('Math').Access('Sqrt'), [ value ]);
      this.macro['PY'] = Tape.Function.Invoke(Tape.Value.Symbol('math').Access('sqrt'), [ value ]);
    }

    public default(): TapeExpression {
      throw new Error('Method not implemented.');
    }
  }
}

export { TapeGlue_Math as TapeGlue_Math };
