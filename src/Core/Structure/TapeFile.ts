import { TapeErrorReporter } from "../Interfaces/TapeErrorReporter";
import { TapeCode } from "../TapeCode";
import { TapeErrors } from "../TapeErrors";
import { TapeGenerator } from "../TapeGenerator";
import { TapeScope } from "../TapeScope";
import { TapeStructure } from "../TapeStructure";
import { TapeDefinition } from "./TapeDefinition";

class TapeFile extends TapeStructure implements TapeErrorReporter {
  private _name: String;
  public get name(): String {
    return this._name;
  }

  private _includes: TapeStructure[] = [];
  public get includes(): ReadonlyArray<TapeStructure> {
    return this._includes;
  }

  private _defs: (TapeDefinition | TapeStructure)[] = [];
  public get defs(): ReadonlyArray<(TapeDefinition | TapeStructure)> {
    return this._defs;
  }
  
  constructor(name: String, includes: TapeStructure[], defs: (TapeStructure)[]) {
    super();
    this._name = name;
    this._includes = includes;
    this._defs = defs;
  }

  $$ReportError(): String {
    return this.name;
  }

  $Build(parent: TapeStructure): TapeErrors {
    let errors = TapeErrors.Empty(this);
    
    this.scope = new TapeScope(this, parent.scope);

    for (let inc of this._includes) {
      let err = inc.$Build(this);
      errors.Map(err);
    }

    for (let def of this._defs) {
      let err = def.$Build(this);
      errors.Map(err);
    }

    return errors;
  }

  $Create(parentScope: TapeScope): (Boolean | String)[] {
    this.scope = new TapeScope(this, parentScope);

    for (let def of this._defs) {
      def.$Create(this.scope);
    }
    
    return this.$Validate();
  }

  $Generate(generator: TapeGenerator): TapeCode {
    let ret = new TapeCode(this);
    
    for (let i of this._includes)
      ret.AddCode(0, i.$Generate(generator));

    for (let d of this._defs)
      ret.AddCode(0, d.$Generate(generator));

    return ret;
  }
}

export { TapeFile as TapeFile };
