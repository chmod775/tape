import { TapeDefinition } from "./Structure/TapeDefinition";

class TapeScope {
  public parent?: TapeScope;
  public defs: { [name: string]: TapeDefinition } = {};

  constructor(parent?: TapeScope, defs: TapeDefinition[] = []) {
    this.parent = parent;
    for (let d of defs)
      this.defs[d.name as string] = d;
  }

  Add(def: TapeDefinition) {
    this.defs[def.name as string] = def;
  }

  Exists(name: String): Boolean {
    let exists = (name as string) in this.defs;
    if (exists) return exists;

    if (this.parent) {
      let existsInParent = this.parent.Exists(name);
      if (existsInParent) return existsInParent;  
    }

    return false;
  }
}

export { TapeScope as TapeScope };
