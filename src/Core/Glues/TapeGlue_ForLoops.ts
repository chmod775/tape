import * as Tape from '../../Tape'
import { TapeStatement } from '../Structure/TapeStatement';
import { TapeExpression } from '../Structure/TapeExpression';
import { TapeValue } from '../Structure/TapeValue';
import { TapeGlue } from '../Structure/TapeGlue';
import { TapeGlue_List } from './TapeGlue_List';

namespace TapeGlue_ForLoops {
  export class Each extends TapeGlue<TapeStatement.For, Each>() {
    public iterator: TapeValue.Symbol;
    public source: TapeValue.Symbol;
    public loop: TapeStatement | TapeExpression;

    constructor(iterator: TapeValue.Symbol, source: TapeValue.Symbol, loop: TapeStatement | TapeExpression) {
      super();

      this.iterator = iterator;
      this.source = source;
      this.loop = loop;
    }
    
    public default(): TapeStatement.For {
      let iteratorIndexName = `${this.iterator.name}_idx`;
      let loopItems = (this.loop instanceof TapeStatement.Block) ? this.loop.items : [ this.loop ];

      return Tape.For(
        Tape.Variable(iteratorIndexName, Tape.Type.Primitive.Int32).InitializeWithValue(Tape.Value.Literal(0)),
        Tape.Expression.Relational(Tape.Value.Symbol(iteratorIndexName), Tape.Expression.RelationalOperators.Less, new TapeGlue_List.Length(this.source)),
        Tape.Expression.Assignment(Tape.Value.Symbol(iteratorIndexName), Tape.Expression.Binary(Tape.Value.Symbol(iteratorIndexName), Tape.Expression.BinaryOperators.Add, Tape.Value.Literal(1)))
      )
      .Loop(Tape.Block([
        Tape.Expression.Assignment(this.iterator, Tape.Expression.Index(Tape.Expression.Value(this.source), Tape.Expression.Value(Tape.Value.Symbol(iteratorIndexName)))),
        ...loopItems
      ]));
    }
  }
}


export { TapeGlue_ForLoops as TapeGlue_ForLoops };
