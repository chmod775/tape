import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";

class TapeInclude extends TapeStructure {
  private _name: String;
  public get name(): String {
    return this._name;
  }

  private _path?: String;
  public get path(): String | undefined {
    return this._path;
  }

  constructor(name: String, path?: String) {
    super();
    this._name = name;
    this._path = path;
  }

  $Generate(generator: TapeGenerator): TapeCode {
    return generator.Include(this);
  }
}

export { TapeInclude as TapeInclude };