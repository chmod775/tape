import { TapeStatement } from "./TapeStatement";
import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";

abstract class TapeLibrary extends TapeStructure {
  public generators: { [language: string]: (generator: TapeGenerator) => TapeCode } = {};

  $Generate(generator: TapeGenerator) : TapeCode {
    let code = this.generators[generator.Name as string];
    if (!code) throw `Undefined code for language generator ${generator.Name}`;

    return code(generator);
  }
}

export { TapeLibrary as TapeLibrary };
