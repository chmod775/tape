import { TapeDefinition } from "./Structure/TapeDefinition";
import { TapeStructure } from "./TapeStructure";

class TapeScope {
  public owner: TapeStructure;
  public parent?: TapeScope;
  public defs: { [name: string]: TapeDefinition } = {};

  constructor(owner: TapeStructure, parent?: TapeScope, defs: TapeDefinition[] = []) {
    this.owner = owner;
    this.parent = parent;
    for (let d of defs)
      this.defs[d.name as string] = d;
  }

  Add(def: TapeDefinition) {
    this.defs[def.name as string] = def;
  }

  ExistsLocal(name: String): Boolean {
    return this.Exists(name, true);
  }

  Exists(name: String, onlyLocal: Boolean = false, stop: (typeof TapeDefinition)[] = []): Boolean {
    let exists = (name as string) in this.defs;
    if (exists) return exists;

    if (this.parent) {
      let stopped = stop ? stop.filter(t => this.parent.owner instanceof t) : [];
      
      if ((stopped.length == 0) && !onlyLocal) {
        let existsInParent = this.parent.Exists(name, onlyLocal, stop);
        if (existsInParent) return existsInParent;  
      }
    }

    return false;
  }
}

export { TapeScope as TapeScope };
