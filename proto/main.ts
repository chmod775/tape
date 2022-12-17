import * as Tape from './Core/Tape'
import { GeneratorJS } from './Generators/GeneratorJS'

let mainBlock = Tape.Block([
  Tape.Variable('a', Tape.DataTypes.Int16).Initialize(Tape.Value.Literal('abc')),
  Tape.Variable('b', Tape.DataTypes.Int16).Initialize(Tape.Value.Array(Tape.Value.Literal(0), Tape.Value.Literal(1), Tape.Value.Literal(2))),

  Tape.Variable('c', Tape.DataTypes.Float).Initialize(Tape.Value.Literal(10))
//  Tape.If(Tape.Expression.Parse('a > b'), Tape.Expression.Assignment(Tape.Value.Symbol('a'), Tape.Value.Literal(10)))
//      .Else(Tape.Expression.Assignment(Tape.Value.Symbol('a'), Tape.Value.Literal(20)))
]);

/*
let vars: Variable[] = [];
for (var i = 0; i < 100; i++)
  vars.push(
    Tape.Variable(`var_${i}`, Tape.DataTypes.Float).Initialize(Tape.Value.Literal(i))
  );
let mainBlock = Tape.Block(vars);
*/

let genOutJS = mainBlock.Generate(new GeneratorJS());
console.log(genOutJS);