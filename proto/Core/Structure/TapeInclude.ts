import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";

class TapeInclude extends TapeStructure {
  public name: String;
  public path?: String;

  constructor(name: String, path?: String) {
    super();
    this.name = name;
    this.path = path;
  }

  $Generate(generator: TapeGenerator): TapeCode {
    return generator.Include(this);
  }
}

export { TapeInclude as TapeInclude };