import * as Tape from './Core/Tape'
import { GeneratorJS } from './Generators/GeneratorJS'
import { GeneratorCS } from './Generators/GeneratorCS'
import { TapeExpression } from './Core/Structure/TapeExpression';
import { TapeScope } from './Core/TapeScope';
import { parse, stringify } from 'yaml'

let fn =   Tape.Function('foo', Tape.Type.Primitive.Float)
.Arguments(Tape.Function.Argument('n1', Tape.Type.Primitive.Float), Tape.Function.Argument('n2', Tape.Type.Primitive.Float))
.Content([
  Tape.Variable('t', Tape.Type.Primitive.Float),
  Tape.If(
    Tape.Expression.Relational(Tape.Value.Symbol('n1'), Tape.Expression.RelationalOperators.Less, Tape.Value.Symbol('n2')),
    Tape.Block([
      Tape.Expression.Assignment(Tape.Value.Symbol('t'), Tape.Value.Symbol('n1')),
      Tape.Expression.Assignment(Tape.Value.Symbol('n1'), Tape.Value.Symbol('n2')),
      Tape.Expression.Assignment(Tape.Value.Symbol('n2'), Tape.Value.Symbol('t'))
    ])
  ),
  //.Else(Tape.Expression.Assignment(Tape.Value.Symbol('a'), Tape.Value.Literal(20))),
  Tape.Variable('ret', Tape.Type.Primitive.Float).InitializeWithExpression(Tape.Expression.Binary(
    Tape.Value.Symbol('n1'),
    Tape.Expression.BinaryOperators.Add,
    Tape.Value.Symbol('n2')
  )),
  Tape.Return(TapeExpression.Value(Tape.Value.Symbol('ret')))
]);

let yaml = stringify(fn);
console.log(yaml);


let mainBlock = new Tape.File([
  Tape.Variable('a', Tape.Type.Primitive.Int16).InitializeWithValue(Tape.Value.Literal('abc')),
  Tape.Variable('b', Tape.Type.Array(Tape.Type.Primitive.Float)).InitializeWithValue(Tape.Value.Array(Tape.Value.Literal(0), Tape.Value.Literal(1), Tape.Value.Literal(2))),

  Tape.Variable('c', Tape.Type.Primitive.Float).InitializeWithValue(Tape.Value.Literal(10)),
  fn,
  fn,

  Tape.Class('car')
      .Fields([ 
        Tape.Class.Field('cv0', Tape.Type.Primitive.Int16).InitializeWithValue(Tape.Value.Literal(0)),
        Tape.Class.Field('cv1', Tape.Type.Primitive.Int16).InitializeWithValue(Tape.Value.Literal(0)),
        Tape.Class.Field('cv2', Tape.Type.Primitive.Int16).InitializeWithValue(Tape.Value.Literal(0)),
        Tape.Class.Field('cv3', Tape.Type.Primitive.Int16).InitializeWithValue(Tape.Value.Literal(0)),
      ])
      .Methods([
        Tape.Class.Method('foo', Tape.Type.Primitive.Float)
        .Arguments(Tape.Function.Argument('n1', Tape.Type.Primitive.Float), Tape.Function.Argument('n2', Tape.Type.Primitive.Float))
        .Content([
          Tape.Variable('t', Tape.Type.Primitive.Float),
          Tape.If(
            Tape.Expression.Relational(Tape.Value.Symbol('n1'), Tape.Expression.RelationalOperators.Less, Tape.Value.Symbol('n2')),
            Tape.Block([
              Tape.Expression.Assignment(Tape.Value.Symbol('c'), Tape.Value.Symbol('n1')),
              Tape.Expression.Assignment(Tape.Value.Symbol('n1'), Tape.Value.Symbol('n2')),
              Tape.Expression.Assignment(Tape.Value.Symbol('n2'), Tape.Value.Symbol('t'))
            ])
          ),

          Tape.Expression.Assignment(Tape.Value.This().Access('cv').Access('t'), Tape.Value.This().Access('cv').Access('t')),

          //.Else(Tape.Expression.Assignment(Tape.Value.Symbol('a'), Tape.Value.Literal(20))),
          Tape.Variable('ret', Tape.Type.Primitive.Float).InitializeWithExpression(Tape.Expression.Binary(
            Tape.Value.Symbol('n1'),
            Tape.Expression.BinaryOperators.Add,
            Tape.Value.Symbol('n2')
          )),
          Tape.Return(TapeExpression.Value(Tape.Value.Symbol('ret')))
        ])
      ])
]);
/*
let rootScope = new TapeScope(null);
let errors = mainBlock.$Create(rootScope);
console.error(errors.filter(e => e != true));
*/
/*
let vars: Variable[] = [];
for (var i = 0; i < 100; i++)
  vars.push(
    Tape.Variable(`var_${i}`, Tape.DataTypes.Float).Initialize(Tape.Value.Literal(i))
  );
let mainBlock = Tape.Block(vars);
*/

let genJs = new GeneratorJS();

let genOutJS = mainBlock.$Generate(genJs);
console.log('##### JS #####');
console.log(genOutJS.ToSource());
console.log('\n');
/*
let rootScope = new TapeScope(null);
let errors = genOutJS.Create(rootScope);
console.error(errors.filter(e => e != true));
/*
//console.log(genOutJS.lines[5].code.lines[1].code.lines[1].code.lines[1]);

/*
let genOutCS = mainBlock.Generate(new GeneratorCS());
console.log('##### C# #####');
console.log(genOutCS.Content());

*/