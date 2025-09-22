import * as fs from 'fs';

import * as Tape from '../../src/Tape'
import { GeneratorJS } from '../../src/Generators/GeneratorJS'
import { GeneratorCS } from '../../src/Generators/GeneratorCS'
import { GeneratorPY } from '../../src/Generators/GeneratorPY';

import { TapeGlue_Console } from '../../src/Core/Glues/TapeGlue_Console';
import { TapeGlue_List } from '../../src/Core/Glues/TapeGlue_List';
import { TapeGlue_Math } from '../../src/Core/Glues/TapeGlue_Math';
import { TapeGlue_ForLoops } from '../../src/Core/Glues/TapeGlue_ForLoops';
import { TapeGlue } from '../../src/Core/Structure/TapeGlue';

let mainBlock = new Tape.File([
  ],[

  Tape.Function('Main')
    .Content([
      Tape.Variable('dict', Tape.Type.Dictionary(Tape.Type.Primitive.Bool)).InitializeWithExpression(Tape.Expression.Value(Tape.Value.Dictionary(Tape.Type.Primitive.Bool, {
        "A": Tape.Value.Literal(false),
        "B": Tape.Value.Literal(false),
        "C": Tape.Value.Literal(false),
        "D": Tape.Value.Literal(false),
        "Data": Tape.Value.Dictionary(Tape.Type.Primitive.Int16, {
          "Z": Tape.Value.Literal(10),
          "ZZ": Tape.Value.Literal(123),
          "Data": Tape.Value.Dictionary(Tape.Type.Primitive.String, {
            "Test": Tape.Value.Literal("HelloWorld")
          })
        })
      })))
    ])
]);

// let genJS = new GeneratorJS();
// let genOutJS = mainBlock.$Generate(genJS);
// let genOutJS_Source = genOutJS.ToSource();
// console.log('##### JS #####');
// console.log(genOutJS_Source);
// console.log('\n');
// fs.writeFileSync('main.js', genOutJS_Source as string);

// let genCS = new GeneratorCS();
// let genOutCS = mainBlock.$Generate(genCS);
// let genOutCS_Source = genOutCS.ToSource();
// console.log('##### CS #####');
// console.log(genOutCS_Source);
// console.log('\n');
// fs.writeFileSync('main.cs', genOutCS_Source as string);

let genPY = new GeneratorPY();
let genOutPY = mainBlock.$Generate(genPY);
let genOutPY_Source = genOutPY.ToSource();
console.log('##### PY #####');
console.log(genOutPY_Source);
console.log('\n');
fs.writeFileSync('main.py', genOutPY_Source as string);