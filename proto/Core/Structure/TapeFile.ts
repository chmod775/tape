import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";
import { TapeDefinition } from "./TapeDefinition";
import { TapeGlue } from "./TapeGlue";
import { TapeInclude } from "./TapeInclude";

class TapeFile extends TapeStructure {
  public includes: TapeGlue<TapeInclude>[] = [];
  public defs: (TapeDefinition | TapeGlue<TapeStructure>)[] = [];

  constructor(includes: TapeGlue<TapeInclude>[], defs: (TapeDefinition | TapeGlue<TapeStructure>)[]) {
    super();
    this.includes = includes;
    this.defs = defs;
  }

  $Generate(generator: TapeGenerator): TapeCode {
    let ret = new TapeCode(this);
    
    for (let i of this.includes)
      ret.AddCode(0, i.$Generate(generator));

    for (let d of this.defs)
      ret.AddCode(0, d.$Generate(generator));

    return ret;
  }
}

export { TapeFile as TapeFile };
