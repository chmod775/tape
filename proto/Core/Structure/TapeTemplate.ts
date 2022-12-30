import { TapeStatement } from "./TapeStatement";
import { TapeCode } from "../TapeCode";
import { TapeGenerator } from "../TapeGenerator";
import { TapeStructure } from "../TapeStructure";

abstract class TapeTemplate<T extends TapeStructure> extends TapeStructure {
  public generators: { [language: string]: T } = {};

  $Generate(generator: TapeGenerator) : TapeCode {
    let template = this.generators[generator.Name as string];
    if (template === undefined) throw `Undefined template for language generator ${generator.Name}`;
    if (template === null) return new TapeCode(this);
    return template.$Generate(generator);
  }
}

export { TapeTemplate as TapeTemplate };
