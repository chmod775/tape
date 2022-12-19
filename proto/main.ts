import * as Tape from './Core/Tape'
import { GeneratorJS } from './Generators/GeneratorJS'
import { GeneratorCS } from './Generators/GeneratorCS'

let mainBlock = new Tape.File([
  Tape.Variable('a', Tape.Type.Primitive.Int16).InitializeWithValue(Tape.Value.Literal('abc')),
  Tape.Variable('b', Tape.Type.Array(Tape.Type.Primitive.Float)).InitializeWithValue(Tape.Value.Array(Tape.Value.Literal(0), Tape.Value.Literal(1), Tape.Value.Literal(2))),

  Tape.Variable('c', Tape.Type.Primitive.Float).InitializeWithValue(Tape.Value.Literal(10)),

  Tape.Function('foo')
      .Arguments(Tape.Function.Argument('n1', Tape.Type.Primitive.Float), Tape.Function.Argument('n2', Tape.Type.Primitive.Float))
      .Content([
        Tape.If(
          Tape.Expression.Relational(Tape.Value.Symbol('a'), Tape.Expression.RelationalOperators.Less, Tape.Value.Symbol('b')),
          Tape.Expression.Assignment(Tape.Value.Symbol('a'), Tape.Value.Literal(10))
        )
        .Else(Tape.Expression.Assignment(Tape.Value.Symbol('a'), Tape.Value.Literal(20))),
        Tape.Variable('c', Tape.Type.Primitive.Float).InitializeWithExpression(Tape.Expression.Binary(
          Tape.Value.Symbol('n1'),
          Tape.Expression.BinaryOperators.Add,
          Tape.Value.Symbol('n2')
        ))
      ]),
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
console.log(genOutJS.Content());

let genOutCS = mainBlock.Generate(new GeneratorCS());
console.log(genOutCS.Content());

