import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";

function TapeGlue<T extends TapeStructure, P>() {
  return class _ extends TapeStructure {
    public static code: { [language: string]: (_: P, generator: TapeGenerator) => TapeCode } = {};
    public static macro: { [language: string]: (_: P) => T } = {};

    public default(): T {
      throw new Error('Method not implemented.');
    }

    $Generate(generator: TapeGenerator): TapeCode {
      let foundMacro = _.macro[generator.Name as string];
      if (foundMacro) {
        let macroLambda = foundMacro(this as unknown as P);
        if (macroLambda === null) return new TapeCode(this);
        return foundMacro(this as unknown as P).$Generate(generator);
      }

      let foundCode = _.code[generator.Name as string];
      if (foundCode) return foundCode(this as unknown as P, generator);

      return this.default().$Generate(generator);
    }
  }
}

export { TapeGlue as TapeGlue };