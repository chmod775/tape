import { TapeCode } from "./TapeCode";
import { TapeGenerator } from "./TapeGenerator";
import { TapeScope } from "./TapeScope";

abstract class TapeStructure {
  private _scope?: TapeScope;
  public get scope(): TapeScope {
    if (this._scope == undefined) throw 'Scope is not defined!';
    return this._scope;
  }
  public set scope(value: TapeScope) {
    this._scope = value;
  }

  $Validate(): (Boolean | String)[] {
    return [];
  }

  $Create(parentScope: TapeScope): (Boolean | String)[] {
    this._scope = parentScope;
    return this.$Validate();
  }

  abstract $Generate(generator: TapeGenerator) : TapeCode;
}

export { TapeStructure as TapeStructure };
