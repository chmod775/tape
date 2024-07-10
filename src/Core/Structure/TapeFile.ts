import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeScope } from "../TapeScope";
import { TapeStructure } from "../TapeStructure";
import { TapeDefinition } from "./TapeDefinition";

class TapeFile extends TapeStructure {
  private _includes: TapeStructure[] = [];
  public get includes(): ReadonlyArray<TapeStructure> {
    return this._includes;
  }

  private _defs: (TapeDefinition | TapeStructure)[] = [];
  public get defs(): ReadonlyArray<(TapeDefinition | TapeStructure)> {
    return this._defs;
  }
  
  constructor(includes: TapeStructure[], defs: (TapeStructure)[]) {
    super();
    this._includes = includes;
    this._defs = defs;
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
