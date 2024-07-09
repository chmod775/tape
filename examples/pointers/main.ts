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
import { GeneratorC } from '../../src/Generators/GeneratorC';
import { TapeType } from '../../src/Core/Structure/TapeType';
import { TapeScope } from '../../src/Core/TapeScope';

let Struct_Motor = Tape.CustomType('Struct_Motor', [
  Tape.CustomType.Item('run', TapeType.Primitive.Bool),
  Tape.CustomType.Item('stop', TapeType.Primitive.Bool)
]);

let Struct_Loop_Instance = Tape.CustomType('Struct_Loop_Instance', [
  Tape.CustomType.Item('Motor_A', Tape.Type.Custom(Struct_Motor)),
  Tape.CustomType.Item('Motor_B', Tape.Type.Custom(Struct_Motor))
]);

let Function_Loop = Tape.Function('Function_Loop', Tape.Type.Primitive.Bool)
  .Arguments(
    Tape.Function.Argument('rlo', Tape.Type.Primitive.Bool),
    Tape.Function.ReadWriteArgument('instance', Tape.Type.Custom(Struct_Motor))
  )
  .Content([
    Tape.Expression.Assignment(Tape.Value.Symbol('instance').Access('run'), Tape.Expression.Binary(Tape.Value.Symbol('rlo'), Tape.Expression.BinaryOperators.LogicAnd, Tape.Value.Symbol('instance').Access('stop'))),
    Tape.Return(Tape.Expression.Value(Tape.Value.Symbol('rlo')))
  ]);


let mainBlock = new Tape.File([
  ],[
  
  Struct_Motor,
  Struct_Loop_Instance,

  Function_Loop,

  Tape.Variable('motors', Tape.Type.Custom(Struct_Loop_Instance)),
  Tape.Function.Invoke(Tape.Value.Symbol('Function_Loop'), [ Tape.Expression.Value(Tape.Value.Literal(true)), Tape.Expression.Value(Tape.Value.Symbol('motors').Access('Motor_A')) ]),
  Tape.Function.Invoke(Tape.Value.Symbol('Function_Loop'), [ Tape.Expression.Value(Tape.Value.Literal(true)), Tape.Expression.Value(Tape.Value.Symbol('motors').Access('Motor_B')) ])
]);

// let genJS = new GeneratorJS();
// let genOutJS = mainBlock.$Generate(genJS);
// let genOutJS_Source = genOutJS.ToSource();
// console.log('##### JS #####');
// console.log(genOutJS_Source);
// console.log('\n');
// fs.promises.mkdir(path.dirname(path.join(__dirname, 'build', 'main.js')), {recursive: true}).then(x => fs.promises.writeFile(path.join(__dirname, 'build', 'main.js'), genOutJS_Source as string))

// let genCS = new GeneratorCS();
// let genOutCS = mainBlock.$Generate(genCS);
// let genOutCS_Source = genOutCS.ToSource();
// console.log('##### CS #####');
// console.log(genOutCS_Source);
// console.log('\n');
// fs.promises.mkdir(path.dirname(path.join(__dirname, 'build', 'dotnet', 'Program.cs')), {recursive: true}).then(x => fs.promises.writeFile(path.join(__dirname, 'build', 'dotnet', 'Program.cs'), genOutCS_Source as string))

// let genPY = new GeneratorPY();
// let genOutPY = mainBlock.$Generate(genPY);
// let genOutPY_Source = genOutPY.ToSource();
// console.log('##### PY #####');
// console.log(genOutPY_Source);
// console.log('\n');
// fs.promises.mkdir(path.dirname(path.join(__dirname, 'build', 'main.py')), {recursive: true}).then(x => fs.promises.writeFile(path.join(__dirname, 'build', 'main.py'), genOutPY_Source as string))

let genC = new GeneratorC();
let genOutC = mainBlock.$Generate(genC);

let rootScope = new TapeScope(mainBlock);
let errors = genOutC.Create(rootScope);
console.error(errors.filter(e => e != true));

let genOutC_Source = genOutC.ToSource();
console.log('##### C #####');
console.log(genOutC_Source);
console.log('\n');
fs.promises.mkdir(path.dirname(path.join(__dirname, 'build', 'main.c')), {recursive: true}).then(x => fs.promises.writeFile(path.join(__dirname, 'build', 'main.c'), genOutC_Source as string))