import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";

abstract class TapeGlue<T extends TapeStructure> extends TapeStructure {
  public code: { [language: string]: (generator: TapeGenerator) => TapeCode } = {};
  public macro: { [language: string]: T } = {};

  public abstract default(): T;

  $Generate(generator: TapeGenerator) : TapeCode {
    let macro = this.macro[generator.Name as string];
    if (macro) return macro.$Generate(generator);
    if (macro === null) return new TapeCode(this);

    let code = this.code[generator.Name as string];
    if (code) return code(generator);

    return this.default().$Generate(generator);
  }
}

export { TapeGlue as TapeGlue };