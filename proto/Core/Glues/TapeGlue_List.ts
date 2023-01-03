import { TapeExpression } from '../Structure/TapeExpression';
import * as Tape from '../Tape'
import { TapeValue } from '../Structure/TapeValue';
import { TapeGlue } from '../Structure/TapeGlue';

namespace TapeGlue_List {
  export class Add extends TapeGlue<TapeExpression, Add>() {
    public source: TapeValue.Symbol;
    public items: TapeExpression[];

    constructor(source: TapeValue.Symbol, items: TapeExpression[] = []) {
      super();
      this.source = source;
      this.items = items;
    }

    public default(): TapeExpression {
      throw new Error('Method not implemented.');
    }
  }

  export class Length extends TapeGlue<TapeExpression, Length>() {
    public source: TapeValue.Symbol;

    constructor(source: TapeValue.Symbol) {
      super();
      this.source = source;
    }

    public default(): TapeExpression {
      throw new Error('Method not implemented.');
    }
  }
}

export { TapeGlue_List as TapeGlue_List };
