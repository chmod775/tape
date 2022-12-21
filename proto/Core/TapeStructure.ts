import { TapeCode } from "./TapeCode";
import { TapeGenerator } from "./TapeGenerator";
import { TapeScope } from "./TapeScope";

abstract class TapeStructure {
  public scope: TapeScope;

  Validate(): (Boolean | String)[] {
    return [];
  }

  Create(parentScope: TapeScope): (Boolean | String)[] {
    this.scope = parentScope;
    return this.Validate();
  }

  abstract Generate(generator: TapeGenerator) : TapeCode;
}

export { TapeStructure as TapeStructure };
