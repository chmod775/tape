import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../Tape'
import { TapeTemplate } from "../Structure/TapeTemplate";
import { TapeValue } from '../Structure/TapeValue';

namespace TapeTemplate_List {
  export class Add extends TapeTemplate<TapeExpression> {
    public source: TapeValue.Symbol;
    public items: TapeExpression[];

    constructor(source: TapeValue.Symbol, items: TapeExpression[] = []) {
      super();
  
      this.source = source;
      this.items = items;

      this.generators['JS'] = Tape.Function.Invoke(source.Access('push'), items);
      this.generators['CS'] = Tape.Function.Invoke(source.Access('Add'), items);
      this.generators['PY'] = Tape.Function.Invoke(source.Access('append'), items);
    }
  }

  export class Length extends TapeTemplate<TapeExpression> {
    public source: TapeValue.Symbol;

    constructor(source: TapeValue.Symbol) {
      super();
  
      this.source = source;

      this.generators['JS'] = Tape.Expression.Value(source.Access('length'));
      this.generators['CS'] = Tape.Function.Invoke(source.Access('Count'));
      this.generators['PY'] = Tape.Function.Invoke(Tape.Value.Symbol('len'), [ Tape.Expression.Value(source) ]);
    }
  }
}

export { TapeTemplate_List as TapeTemplate_List };