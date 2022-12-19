import { TapeDefinition } from "./TapeDefinition";

class TapeScope {
  public defs: { [name: string]: TapeDefinition } = {};

  constructor(defs: TapeDefinition[]) {
    for (let d of defs)
      this.defs[d.name as string] = d;
  }
}

export { TapeScope as TapeScope };
