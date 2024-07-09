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

  GetBackward(type: typeof TapeDefinition): TapeScope {
    if (this.owner instanceof type) return this;
    if (!this.parent) return null;
    return this.parent.GetBackward(type);
  }

  Find(name: String, onlyLocal: Boolean = false, stop: (typeof TapeDefinition)[] = []): TapeDefinition {
    let found = this.defs[name as string];
    if (found) return found;

    if (this.parent) {
      let stopped = stop ? stop.filter(t => this.parent.owner instanceof t) : [];
      
      if ((stopped.length == 0) && !onlyLocal) {
        let foundInParent = this.parent.Find(name, onlyLocal, stop);
        if (foundInParent) return foundInParent;
      }
    }

    return null;
  }

  ExistsLocal(name: String): Boolean {
    return this.Exists(name, true);
  }

  Exists(name: String, onlyLocal: Boolean = false, stop: (typeof TapeDefinition)[] = []): Boolean {
    return !!this.Find(name, onlyLocal, stop);
  }

  Print(indent: number = 0): string {
    return [
      ' '.repeat(+indent) + this.owner.constructor.name,
      ' '.repeat(+indent) + Object.keys(this.defs),
      this.parent ? this.parent.Print(indent + 1) : ''
    ].join('\n');
  }
}

export { TapeScope as TapeScope };
