import { TapeStatement } from "./TapeStatement";
import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";

abstract class TapeLibrary<T extends TapeStructure> extends TapeStructure {
  public generators: { [language: string]: (generator: TapeGenerator) => TapeCode } = {};

  public abstract template(): T;

  $Generate(generator: TapeGenerator) : TapeCode {
    let code = this.generators[generator.Name as string];
    if (code) return code(generator);

    return this.template().$Generate(generator);
  }
}

export { TapeLibrary as TapeLibrary };
