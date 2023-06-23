import * as fs from 'fs';
import * as path from 'path';

import * as Tape from '../../src/Tape'
import { GeneratorJS } from '../../src/Generators/GeneratorJS'
import { GeneratorCS } from '../../src/Generators/GeneratorCS'
import { GeneratorPY } from '../../src/Generators/GeneratorPY';

import { TapeGlue_Console } from '../../src/Core/Glues/TapeGlue_Console';
import { TapeGlue_List } from '../../src/Core/Glues/TapeGlue_List';
import { TapeGlue_Math } from '../../src/Core/Glues/TapeGlue_Math';
import { TapeGlue_ForLoops } from '../../src/Core/Glues/TapeGlue_ForLoops';

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
fs.promises.mkdir(path.dirname(path.join(__dirname, 'build', 'main.js')), {recursive: true}).then(x => fs.promises.writeFile(path.join(__dirname, 'build', 'main.js'), genOutJS_Source as string))

let genCS = new GeneratorCS();
let genOutCS = mainBlock.$Generate(genCS);
let genOutCS_Source = genOutCS.ToSource();
console.log('##### CS #####');
console.log(genOutCS_Source);
console.log('\n');
fs.promises.mkdir(path.dirname(path.join(__dirname, 'build', 'dotnet', 'Program.cs')), {recursive: true}).then(x => fs.promises.writeFile(path.join(__dirname, 'build', 'dotnet', 'Program.cs'), genOutCS_Source as string))

let genPY = new GeneratorPY();
let genOutPY = mainBlock.$Generate(genPY);
let genOutPY_Source = genOutPY.ToSource();
console.log('##### PY #####');
console.log(genOutPY_Source);
console.log('\n');
fs.promises.mkdir(path.dirname(path.join(__dirname, 'build', 'main.py')), {recursive: true}).then(x => fs.promises.writeFile(path.join(__dirname, 'build', 'main.py'), genOutPY_Source as string))