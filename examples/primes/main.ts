import * as fs from 'fs';

import * as Tape from './Core/Tape'
import { GeneratorJS } from './Generators/GeneratorJS'
import { GeneratorCS } from './Generators/GeneratorCS'
import { GeneratorPY } from './Generators/GeneratorPY';

import { TapeGlue_Console } from './Core/Glues/TapeGlue_Console';
import { TapeGlue_List } from './Core/Glues/TapeGlue_List';
import { TapeGlue_Math } from './Core/Glues/TapeGlue_Math';
import { TapeGlue_ForLoops } from './Core/Glues/TapeGlue_ForLoops';
import { TapeGlue } from './Core/Structure/TapeGlue';

/*
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
      ]),
  Tape.Function('main', Tape.Type.Primitive.Float)
      .Content([
        Tape.Function.Invoke(Tape.Value.Symbol('foo'), [ Tape.Expression.Value(Tape.Value.Literal(1)), Tape.Expression.Value(Tape.Value.Literal(2)) ])
      ]),
  
  Tape.Variable('inst', Tape.Type.Class(Tape.Value.Symbol('car'))).InitializeWithExpression(Tape.Class.New(Tape.Value.Symbol('car'))),

  new TapeTemplate_Console(Tape.Expression.Value(Tape.Value.Symbol('inst'))),
  new TapeTemplate_Console(Tape.Function.Invoke(Tape.Value.Symbol('foo'), [ Tape.Expression.Value(Tape.Value.Literal(1)), Tape.Expression.Value(Tape.Value.Literal(2)) ]))
]);
*/
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

let mainBlock = new Tape.File([
    new TapeGlue_Math.Dependecies()
  ],[
  Tape.Function('GeneratePrimes', Tape.Type.List(Tape.Type.Primitive.Int32))
      .Arguments(Tape.Function.Argument('maxValue', Tape.Type.Primitive.Int32))
      .Content([
        Tape.If(
          Tape.Expression.Relational(Tape.Value.Symbol('maxValue'), Tape.Expression.RelationalOperators.Less, Tape.Value.Literal(2)),
          Tape.Block([
            Tape.Return(Tape.Expression.Value(Tape.Value.List(Tape.Type.Primitive.Int32)))
          ])
        ),

        Tape.Variable('primes', Tape.Type.List(Tape.Type.Primitive.Int32)).InitializeWithExpression(Tape.Expression.Value(Tape.Value.List(Tape.Type.Primitive.Int32))),

        new TapeGlue_List.Add(Tape.Value.Symbol('primes'), [ Tape.Expression.Value(Tape.Value.Literal(2)) ]),

        Tape.For(
          Tape.Variable('i', Tape.Type.Primitive.Int32).InitializeWithValue(Tape.Value.Literal(3)),
          Tape.Expression.Relational(Tape.Value.Symbol('i'), Tape.Expression.RelationalOperators.LessEqual, Tape.Value.Symbol('maxValue')),
          Tape.Expression.Assignment(Tape.Value.Symbol('i'), Tape.Expression.Binary(Tape.Value.Symbol('i'), Tape.Expression.BinaryOperators.Add, Tape.Value.Literal(2)))
        )
        .Loop(Tape.Block([
          Tape.Variable('isPrime', Tape.Type.Primitive.Bool).InitializeWithValue(Tape.Value.Literal(true)),

          Tape.For(
            Tape.Variable('j', Tape.Type.Primitive.Int32).InitializeWithValue(Tape.Value.Literal(2)),
            Tape.Expression.Relational(Tape.Value.Symbol('j'), Tape.Expression.RelationalOperators.LessEqual, new TapeGlue_Math.Sqrt(Tape.Expression.Value(Tape.Value.Symbol('i')))),
            Tape.Expression.Assignment(Tape.Value.Symbol('j'), Tape.Expression.Binary(Tape.Value.Symbol('j'), Tape.Expression.BinaryOperators.Add, Tape.Value.Literal(1)))
          )
          .Loop(Tape.Block([
            Tape.If(
              Tape.Expression.Relational(Tape.Expression.Binary(Tape.Value.Symbol('i'), Tape.Expression.BinaryOperators.Modulo, Tape.Value.Symbol('j')), Tape.Expression.RelationalOperators.Equal, Tape.Value.Literal(0)),
              Tape.Block([
                Tape.Expression.Assignment(Tape.Value.Symbol('isPrime'), Tape.Expression.Value(Tape.Value.Literal(false))),
                Tape.For.Break()
              ])
            ),
          ])),

          Tape.If(
            Tape.Expression.Relational(Tape.Value.Symbol('isPrime'), Tape.Expression.RelationalOperators.Equal, Tape.Value.Literal(true)),
            Tape.Block([
              new TapeGlue_List.Add(Tape.Value.Symbol('primes'), [ Tape.Expression.Value(Tape.Value.Symbol('i')) ]),
            ])
          ),
        ])),

        Tape.Return(Tape.Expression.Value(Tape.Value.Symbol('primes')))
      ]),

  Tape.Variable('primes', Tape.Type.List(Tape.Type.Primitive.Int32)).InitializeWithExpression(Tape.Function.Invoke(Tape.Value.Symbol('GeneratePrimes'), [ Tape.Expression.Value(Tape.Value.Literal(100)) ])),

  //new TapeGlue_Console(Tape.Expression.Value(Tape.Value.Symbol('primes'))),

  new TapeGlue_ForLoops.Each(Tape.Value.Symbol('item'), Tape.Value.Symbol('primes'), Tape.Block([
    new TapeGlue_Console(Tape.Expression.Value(Tape.Value.Symbol('item'))),
  ]))
]);

let genJS = new GeneratorJS();
let genOutJS = mainBlock.$Generate(genJS);
let genOutJS_Source = genOutJS.ToSource();
console.log('##### JS #####');
console.log(genOutJS_Source);
console.log('\n');
fs.writeFileSync('main.js', genOutJS_Source as string);

let genCS = new GeneratorCS();
let genOutCS = mainBlock.$Generate(genCS);
let genOutCS_Source = genOutCS.ToSource();
console.log('##### CS #####');
console.log(genOutCS_Source);
console.log('\n');
fs.writeFileSync('main.cs', genOutCS_Source as string);

let genPY = new GeneratorPY();
let genOutPY = mainBlock.$Generate(genPY);
let genOutPY_Source = genOutPY.ToSource();
console.log('##### PY #####');
console.log(genOutPY_Source);
console.log('\n');
fs.writeFileSync('main.py', genOutPY_Source as string);


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