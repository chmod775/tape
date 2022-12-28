import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";
import { TapeTemplate } from "./TapeTemplate";
import { TapeDefinition } from "./TapeDefinition";

class TapeFile extends TapeStructure {
  public defs: (TapeDefinition | TapeTemplate)[] = [];

  constructor(defs: (TapeDefinition | TapeTemplate)[]) {
    super();
    this.defs = defs;
  }

  $Generate(generator: TapeGenerator): TapeCode {
    let ret = new TapeCode(this);
    
    for (let d of this.defs)
      ret.AddCode(0, d.$Generate(generator));

    return ret;
  }
}

export { TapeFile as TapeFile };
