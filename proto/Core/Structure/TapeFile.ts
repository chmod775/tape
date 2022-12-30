import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";
import { TapeTemplate } from "./TapeTemplate";
import { TapeDefinition } from "./TapeDefinition";
import { TapeLibrary } from "./TapeLibrary";
import { TapeInclude } from "./TapeInclude";

class TapeFile extends TapeStructure {
  public includes: TapeTemplate<TapeInclude>[] = [];
  public defs: (TapeDefinition | TapeTemplate<TapeStructure> | TapeLibrary<TapeStructure>)[] = [];

  constructor(includes: TapeTemplate<TapeInclude>[], defs: (TapeDefinition | TapeTemplate<TapeStructure> | TapeLibrary<TapeStructure>)[]) {
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
