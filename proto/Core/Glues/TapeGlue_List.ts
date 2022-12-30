import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../Tape'
import { TapeValue } from '../Structure/TapeValue';
import { TapeGlue } from '../Structure/TapeGlue';

namespace TapeGlue_List {
  export class Add extends TapeGlue<TapeExpression> {
    public source: TapeValue.Symbol;
    public items: TapeExpression[];

    constructor(source: TapeValue.Symbol, items: TapeExpression[] = []) {
      super();
  
      this.source = source;
      this.items = items;

      this.macro['JS'] = Tape.Function.Invoke(source.Access('push'), items);
      this.macro['CS'] = Tape.Function.Invoke(source.Access('Add'), items);
      this.macro['PY'] = Tape.Function.Invoke(source.Access('append'), items);
    }

    public default(): TapeExpression {
      throw new Error('Method not implemented.');
    }
  }

  export class Length extends TapeGlue<TapeExpression> {
    public source: TapeValue.Symbol;

    constructor(source: TapeValue.Symbol) {
      super();
  
      this.source = source;

      this.macro['JS'] = Tape.Expression.Value(source.Access('length'));
      this.macro['CS'] = Tape.Function.Invoke(source.Access('Count'));
      this.macro['PY'] = Tape.Function.Invoke(Tape.Value.Symbol('len'), [ Tape.Expression.Value(source) ]);
    }

    public default(): TapeExpression {
      throw new Error('Method not implemented.');
    }
  }
}

export { TapeGlue_List as TapeGlue_List };
