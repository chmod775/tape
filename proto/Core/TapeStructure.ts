import { TapeCode } from "./TapeCode";
import { TapeGenerator } from "./TapeGenerator";
import { TapeScope } from "./TapeScope";

abstract class TapeStructure {
  public scope: TapeScope;

  abstract Substructure(): TapeStructure[];

  $Create(parentScope: TapeScope): (Boolean | String)[] {
    console.log('created', this.constructor.name);
    
    let ret: (Boolean | String)[] = [];
    ret.push(...this.Create(parentScope));

    if (!this.scope) throw `Scope must be assigned`;
    ret.push(...this.CreateStructure());
    
    return ret;
  }

  Validate(): (Boolean | String)[] {
    return [];
  }

  Create(parentScope: TapeScope): (Boolean | String)[] {
    this.scope = parentScope;
    return this.Validate();
  }

  CreateStructure(): (Boolean | String)[] {
    let ret: (Boolean | String)[] = [];

    let substructure = this.Substructure();
    for (let i of substructure)
      if (i)
        ret.push(...i.$Create(this.scope));
    
    return ret;
  }

  abstract Generate(generator: TapeGenerator) : TapeCode;
}

export { TapeStructure as TapeStructure };
