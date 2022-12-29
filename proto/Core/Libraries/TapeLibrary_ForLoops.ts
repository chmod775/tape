import * as Tape from '../Tape'
import { TapeLibrary } from '../Structure/TapeLibrary';
import { TapeStatement } from '../Structure/TapeStatement';
import { TapeExpression } from '../Structure/TapeExpression';
import { TapeDefinition } from '../Structure/TapeDefinition';
import { TapeValue } from '../Structure/TapeValue';
import { TapeCode } from '../TapeCode';
import { TapeGenerator } from '../TapeGenerator';

namespace TapeLibrary_ForLoops {
  export class Each extends TapeLibrary {
    public iterator: TapeValue.Symbol;
    public source: TapeValue.Symbol;
    public loop: TapeStatement | TapeExpression;

    constructor(iterator: TapeValue.Symbol, source: TapeValue.Symbol, loop: TapeStatement | TapeExpression) {
      super();
  
      this.iterator = iterator;
      this.source = source;
      this.loop = loop;

      this.generators['JS'] = (generator: TapeGenerator) => {
        let ret = new TapeCode(this);
    
        ret.AddContent(0, 'for (let $0 in $1)', this.iterator.$Generate(generator), this.source.$Generate(generator));
        ret.AddCode(0, this.loop.$Generate(generator));
    
        return ret;
      }
      //this.generators['CS'] = Tape.Function.Invoke(source.Access('Add'), items);
      //this.generators['PY'] = Tape.Function.Invoke(source.Access('append'), items);
    }
  }
}

export { TapeLibrary_ForLoops as TapeLibrary_ForLoops };
