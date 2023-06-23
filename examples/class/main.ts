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

  Tape.Class('Car')
      .Fields([
        Tape.Class.Field('Make', Tape.Type.Primitive.String).InitializeWithValue(Tape.Value.Literal("")),
        Tape.Class.Field('Model', Tape.Type.Primitive.String).InitializeWithValue(Tape.Value.Literal("")),
        Tape.Class.Field('Year', Tape.Type.Primitive.Int16).InitializeWithValue(Tape.Value.Literal(0)),
      ])
      .Constructors([
        Tape.Class.Constructor()
        .Arguments()
        .Content([
          new TapeGlue_Console(Tape.Expression.Value(Tape.Value.Literal('Honk! Honk!'))),
        ])
      ])
      .Methods([
        Tape.Class.Method('HonkHorn', Tape.Type.Primitive.Void)
        .Arguments()
        .Content([
          new TapeGlue_Console(Tape.Expression.Value(Tape.Value.Literal('Honk! Honk!'))),
        ])
      ])
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