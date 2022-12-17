import * as Tape from './Core/Tape'
import { GeneratorJS } from './Generators/GeneratorJS'

let mainBlock = Tape.Block([
  Tape.Variable('a', Tape.DataTypes.Int16).Initialize(Tape.Value.Literal(0)),
  Tape.Variable('b', Tape.DataTypes.Int16).Initialize(Tape.Value.Literal(0)),

//  Tape.If(Tape.Expression.Parse('a > b'), Tape.Expression.Assignment(Tape.Value.Symbol('a'), Tape.Value.Literal(10)))
//      .Else(Tape.Expression.Assignment(Tape.Value.Symbol('a'), Tape.Value.Literal(20)))
]);


let mainGeneratorJS = new GeneratorJS();
let genOut = mainBlock.Generate(mainGeneratorJS);
console.log(genOut);